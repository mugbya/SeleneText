const { ipcMain, BrowserWindow } = require('electron');
const path = require('path');
const fs = require("fs");
const { getMainWindow } = require(path.join(global.__root, 'src/view/windowManager'));


function registerCommonHandlers() {

  // ipcMain.handle("show-alert", async (event, {msg}) => {
  //   console.log("show-alert %s", msg)
  //   dialog.showMessageBox({
  //     type: "info",
  //     msg,
  //     buttons: ["确定"],
  //   });
  // });

  ipcMain.on('toggle-devtools', () => {
    const mainWindow = getMainWindow();
    if (!mainWindow) return;
    const webContents = mainWindow.webContents;
    if (webContents.isDevToolsOpened()) {
      webContents.closeDevTools();
    } else {
      webContents.openDevTools({ mode: 'detach' });
    }
  });

  ipcMain.handle('image-base64', async (event, imagePath) => {
    if (typeof imagePath !== "string") {
      throw new TypeError(`无效的路径: 必须是字符串，但收到的是 ${typeof imagePath}`);
    }
    // console.log("image-base64, imagePath: ", imagePath);
    const data = fs.readFileSync(imagePath);
    const base64 = data.toString("base64");
    return base64;
  });

}

module.exports = {
  registerCommonHandlers,
};
