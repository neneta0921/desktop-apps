const form = document.getElementById('image-form')
const slider = document.getElementById('slider')
const img = document.getElementById('img')

// 画像を出力するパスを表示する
// contextBridge
window.onload = async (event) => {
  document.getElementById(
    'output-path'
  ).innerText = await window.api.getSavePath()
}

// レンダラープロセスからメインプロセスにイベントを渡す処理
form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const imgPath = img.files[0].path
  const quality = slider.value

  // contextBridge
  await window.api.imageMinimize(imgPath, quality)
})

// イメージを圧縮した後にメインプロセスから処理を受け取る
// contextBridge
window.api.imageDone((quality) => {
  M.toast({
    html: `画像を${quality}%圧縮しました`,
  })
})
