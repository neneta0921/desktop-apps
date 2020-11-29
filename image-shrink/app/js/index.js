const path = require('path')
const os = require('os')
const { ipcRenderer } = require('electron')

const form = document.getElementById('image-form')
const slider = document.getElementById('slider')
const img = document.getElementById('img')

// 画像を出力するパスを表示する
document.getElementById('output-path').innerText = path.join(
  os.homedir(),
  'imageshrink'
)

// レンダラープロセスからメインプロセスにイベントを渡す処理
form.addEventListener('submit', (e) => {
  e.preventDefault()

  const imgPath = img.files[0].path
  const quality = slider.value

  ipcRenderer.send('image:minimize', {
    imgPath,
    quality,
  })
})

// イメージを圧縮した後にメインプロセスから処理を受け取る
ipcRenderer.on('image:done', () => {
  M.toast({
    html: `画像を${slider.value}%圧縮しました`,
  })
})
