const form = document.getElementById('image-form')
const slider = document.getElementById('slider')
const img = document.getElementById('img')

let prevImgSize = 0

// 画像を出力するパスを表示する
// contextBridge
window.onload = async (event) => {
  document.getElementById(
    'output-path'
  ).innerText = await window.api.getSavePath()
}

// 圧縮前のファイルサイズの合計を計算する
function prevImgSizeSum(obj) {
  const result = Object.entries(obj)
    .map((file) => file[1].size)
    .reduce((prev, current) => {
      return prev + current
    }, 0)
  return result
}

// レンダラープロセスからメインプロセスにイベントを渡す処理
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  // パスを格納する
  const imgPathArray = Object.entries(img.files).map((file) => file[1].path)
  // 圧縮前のファイルサイズの合計を計算する
  prevImgSize = prevImgSizeSum(img.files)
  const quality = slider.value

  // contextBridge
  await window.api.imageMinimize(imgPathArray, quality)
})

// イメージを圧縮した後にメインプロセスから処理を受け取る
// contextBridge
window.api.imageDone((afterImgSize) => {
  // 圧縮率を計算
  const quality = Math.floor((1 - afterImgSize / prevImgSize) * 100)
  // 処理完了を通知
  M.toast({
    html: `画像を${quality}%圧縮しました`,
  })
})
