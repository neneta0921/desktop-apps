# 画像圧縮ツール
web用の画像をローカル環境で一括で圧縮できるソフトです。  
圧縮処理はnpmのライブラリを利用して実装しています。  
現在はWindowsにのみ対応しています。  

- [インストーラ版](https://github.com/neneta0921/desktop-apps/raw/main/image-shrink/ImageShrink-Win-Setup-1.0.0.zip)
- [ポータル版](https://github.com/neneta0921/desktop-apps/raw/main/image-shrink/ImageShrink-Win-Portable-1.0.0.zip)

## 使用方法：インストーラ版
1. [ダウンロード](https://github.com/neneta0921/desktop-apps/raw/main/image-shrink/ImageShrink-Win-Setup-1.0.0.zip)して解凍してください。
2. ImageShrink Setup 1.0.0.exeを実行するとインストーラーが起動するので、Windowsにインストールしてください。
3. インストールが完了したらソフトを起動し、画像ファイルを選んで圧縮してください。  
※ アンインストールする場合は、通常のソフトと同様に「アプリと機能」からアンインストールできます。

## 使用方法：ポータル版
1. [ダウンロード](https://github.com/neneta0921/desktop-apps/raw/main/image-shrink/ImageShrink-Win-Portable-1.0.0.zip)して解凍してください。
2. ImageShrink.exeを実行するとソフトが起動します。
3. 画像ファイルを選んで圧縮してください。  
※ フォルダごと削除すればアンインストールできます。

## 機能
- jpg, png, gif, svgの画像形式に対応
- 複数の画像ファイルをまとめて圧縮
- jpgとpngは圧縮率を調整可能

## 使用技術
- electron
- node.js
- npm
