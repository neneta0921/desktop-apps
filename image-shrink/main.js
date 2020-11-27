const { app, BrowserWindow } = require("electron");

// 開発環境に設定
process.env.NODE_ENV = "development";

const isDev = process.env.NODE_ENV !== "production" ? true : false;
const isWin = process.platform === "win32" ? true : false;
const isMac = process.platform === "darwin" ? true : false;

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "画像圧縮ツール",
    width: 500,
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_32x32.png`,
    resizable: isDev,
  });

  mainWindow.loadFile(`${__dirname}/app/index.html`);

  // ターミナルのエラーメッセージを非表示にするために設定
  webPreferences: {
    contextIsolation: true;
  }
}

app.on("ready", createMainWindow);

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
