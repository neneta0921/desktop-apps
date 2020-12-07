const form = document.getElementById('image-form')
const slider = document.getElementById('slider')
const img = document.getElementById('img')
const fileName = document.getElementById('file-name')

let previousImgSize = 0

// 画像を出力するパスを表示する
// contextBridge
window.onload = async (event) => {
  const outputPath = document.getElementById('output-path')
  outputPath.textContent = await window.api.getSavePath()
}

// 圧縮前のファイルサイズの合計を計算する
function sumPreviousImgSize(obj) {
  const result = Object.entries(obj)
    .map((file) => file[1].size)
    .reduce((prev, current) => {
      return prev + current
    }, 0)
  return result
}

// toastを表示する
function outputMessage(text) {
  M.toast({
    html: text,
  })
}

function validFileType(files) {
  const fileTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml']

  if (files.length === 0) {
    outputMessage(`画像を選択してください`)
    return false
  }

  for (file of files) {
    if (!fileTypes.includes(file.type)) {
      outputMessage(`${file.name}は圧縮できません`)
      outputMessage(`.jpg, .png, .gif, .svgを選択してください `)
      return false
    }
  }
  return true
}

// レンダラープロセスからメインプロセスにイベントを渡す処理
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  // ファイルを検証する
  const isValidated = validFileType(img.files)

  if (!isValidated) {
    return
  } else {
    // パスを格納する
    const imgPathArray = Object.entries(img.files).map((file) => file[1].path)
    // 圧縮前のファイルサイズの合計を計算する
    previousImgSize = sumPreviousImgSize(img.files)
    // 圧縮の品質
    const quality = slider.value

    // contextBridge
    await window.api.imageMinimize(imgPathArray, quality)
  }
})

// イメージを圧縮した後にメインプロセスから処理を受け取る
// contextBridge
window.api.imageDone((afterImgSize) => {
  // 圧縮率を計算
  const quality = Math.floor((1 - afterImgSize / previousImgSize) * 100)
  // 処理完了を通知
  outputMessage(`画像を${quality}%圧縮しました`)
  // 表示していたファイル名をクリア
  fileName.value = ''
})
