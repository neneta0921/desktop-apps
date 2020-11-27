const { app, BrowserWindow } = require("electron");

function createMainWindow() {
  const createMainWindow = new BrowserWindow({
    title: "画像圧縮ツール",
    width: 500,
    height: 600,
  });
}

app.on("ready", createMainWindow);
