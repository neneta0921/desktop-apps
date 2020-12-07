const path = require('path')
const os = require('os')
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const imagemin = require('imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')
const imageminGifsicle = require('imagemin-gifsicle')
const imageminSvgo = require('imagemin-svgo')
const slash = require('slash')
const log = require('electron-log')

// 開発環境に設定
process.env.NODE_ENV = 'development'
// process.env.NODE_ENV = 'production'

const isDev = process.env.NODE_ENV !== 'production' ? true : false
const isMac = process.platform === 'darwin' ? true : false

let mainWindow
let aboutWindow

// メイン画面にindex.htmlを読み込み、メイン画面を描画する関数
function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: '画像圧縮ツール',
    width: isDev ? 700 : 500,
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_32x32.png`,
    resizable: isDev,
    backgroundColor: 'white',
    webPreferences: {
      // In Electron 12, the default will be changed to true.
      worldSafeExecuteJavaScript: true,
      // XSS対策としてnodeモジュールをレンダラープロセスで使えなくする
      // nodeIntegration: true,
      nodeIntegration: false,
      // レンダラープロセスに公開するAPIのファイル
      contextIsolation: true,
      preload: path.resolve(`${__dirname}/preload.js`),
    },
  })

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.loadFile(`${__dirname}/app/index.html`)
}

// About画面にabout.htmlを読み込み、About画面を描写する関数
function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    title: '画像圧縮ツール',
    width: 300,
    height: 300,
    icon: `${__dirname}/assets/icons/Icon_32x32.png`,
    resizable: false,
    backgroundColor: 'white',
  })

  aboutWindow.loadFile(`${__dirname}/app/about.html`)
}

// メイン画面を呼び出し、カスタムしたメニューバーを表示する
app.on('ready', () => {
  // メイン画面を表示
  createMainWindow()
  // メニューバーを表示
  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)

  mainWindow.on('closed', () => (mainWindow = null))
})

// メニューバーの項目を設定する
const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: 'about',
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  {
    role: 'fileMenu',
  },
  ...(!isMac
    ? [
        {
          label: 'Help',
          submenu: [
            {
              label: 'about',
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  ...(isDev
    ? [
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'toggledevtools' },
          ],
        },
      ]
    : []),
]

// ファイルの出力先を表示
ipcMain.handle('image:savePath', (e) => {
  const savePath = slash(path.join(os.homedir(), 'imageshrink'))
  return savePath
})

// レンダラープロセスからイベントを受け取る処理
ipcMain.on('image:minimize', (e, options) => {
  options.dest = path.join(os.homedir(), 'imageshrink')
  shrinkImage(options)
})

function imageMinimize(imgPath, quality, dest, pngQuality) {
  const files = imagemin([slash(imgPath)], {
    destination: slash(dest),
    plugins: [
      imageminMozjpeg({ quality }),
      imageminPngquant({
        quality: [pngQuality, pngQuality],
      }),
      imageminGifsicle(),
      imageminSvgo(),
    ],
  })
  return files
}

function logFormat(files) {
  const result = {
    sourcePath: files[0].sourcePath,
    destinationPath: slash(files[0].destinationPath),
  }
  return result
}

// 圧縮後のファイルサイズの合計を計算する関数
function afterImgSizeSum(minimizeFilesArray) {
  const fs = require('fs')

  // mapでsizeを取り出しreduceで足し合わせる
  const afterImgSize = minimizeFilesArray
    .map((filePath) => {
      const stats = fs.statSync(filePath)
      return stats.size
    })
    .reduce((prev, current) => {
      return prev + current
    }, 0)

  return afterImgSize
}

// 外部ライブラリを利用して画像を非同期的に圧縮する関数
async function shrinkImage({ imgPathArray, quality, dest }) {
  const { shell } = require('electron')

  try {
    // pngの圧縮率を調整する
    const pngQuality = quality / 100

    // 画像を圧縮し、圧縮後のファイルパスを取得する
    const minimizeFilesArray = []
    for (imgPath of imgPathArray) {
      // 画像を圧縮する
      const files = await imageMinimize(imgPath, quality, dest, pngQuality)
      // ログ用にデータを整形
      const result = logFormat(files)
      // logを書き込む
      log.info(result)
      // 圧縮後のファイルパスを配列に格納する
      minimizeFilesArray.push(slash(files[0].destinationPath))
    }

    // 圧縮後のファイルサイズの合計を計算する
    const afterImgSize = afterImgSizeSum(minimizeFilesArray)

    // 圧縮したファイルが存在するフォルダを開く
    shell.openPath(slash(dest))

    // 圧縮処理が完了したことをレンダラープロセスに伝える
    mainWindow.webContents.send('image:done', afterImgSize)
  } catch (err) {
    log.error(err)
  }
}

// 画面を閉じたときにプログラムを終了させるイベントリスナー
app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})

// アプリケーションがアクティブにされた後で表示するウインドウがない場合にのみ新しいブラウザーウインドウを作成する
// 例えば、アプリケーションを初めて起動した後や、既に起動しているアプリケーションを再びアクティブした場合など
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
