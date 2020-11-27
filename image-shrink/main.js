const { app, BrowserWindow } = require("electron");

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "画像圧縮ツール",
    width: 500,
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_32x32.png`,
  });

  mainWindow.loadFile(`${__dirname}/app/index.html`);
}

app.on("ready", createMainWindow);
