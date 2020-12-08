const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  // 画像を保存するパスを表示
  getSavePath: () =>
    ipcRenderer.invoke('image:savePath').then((result) => result),

  // 画像の圧縮処理をメインプロセスで行う
  imageMinimize: (imgPathArray, quality) =>
    ipcRenderer.send('image:minimize', { imgPathArray, quality }),

  // 画像の圧縮処理の完了を通知する
  imageDone: (listener) =>
    ipcRenderer.on('image:done', (event, arg) => listener(arg)),

  // 画像の圧縮処理のエラーを通知する
  imageError: (listener) =>
    ipcRenderer.on('image:error', (event) => listener()),
})
