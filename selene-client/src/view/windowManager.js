const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const path = require('path');
const { buildAppMenu } = require(path.join(global.__root, 'src/view/menu/buildMenu'));

let mainWindow = null;
const isDev = !app.isPackaged;

/**
 * 创建主窗口
 */
function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        show: false, // 等 ready-to-show 再显示
        webPreferences: {
            preload: path.join(__dirname, '../../preload.js'),
            contextIsolation: true,  // ✅ 开启上下文隔离
            nodeIntegration: false,  // ✅ 禁用 Node 集成
            sandbox: false, // ✅ 必须显式关闭 sandbox
            // devTools: true,
        },
        title: "Selene Text"
    });

    // 加载页面
    //   if (process.env.VITE_DEV_SERVER_URL) {
    //     mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    //   } else {
    //     mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
    //   }

    if (isDev) {
        // 隔离不同环境的 localStorage / 渲染进程缓存
        app.setPath("userData", path.join(app.getPath("appData"), mainWindow.title.concat("-dev")));
        console.log("userData: ", app.getPath("userData"));
        mainWindow.loadURL('http://localhost:5173'); // ✅ 重要 开发时加载 Vite，本地页面
        mainWindow.webContents.openDevTools();
    } else {
        // 注意这里路径要正确指向 `selene-ui-react` 打包产物
        mainWindow.loadFile(path.join(global.__root, 'renderer/index.html'));
    }

    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
        console.error('❌ Failed to load:', validatedURL, errorDescription);
    });
    mainWindow.webContents.on('did-finish-load', () => {
        console.log('✅ Page loaded');
    });

    // 构建菜单
    buildAppMenu('zh');

    // ready 后显示
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // 关闭时清理
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    return mainWindow;
}

/**
 * 获取主窗口实例
 */
function getMainWindow() {
    return mainWindow;
}

module.exports = {
    createMainWindow,
    getMainWindow,
};
