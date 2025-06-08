// electron/main.js
const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs');
const { spawn } = require('child_process')
const { createFileMenu } = require(path.join(__dirname, 'src/menu/FileMenu'));  // 引入自定义菜单模块
const createAppMenu = require(path.join(__dirname, 'src/menu/AppMenu'));        // 👈 新增 appMenu 模块
const {registerAllIpcHandlers} = require(path.join(__dirname, 'src/ipc'));        // 所有 ipc 处理器





ipcMain.handle('read-file', async (event, filePath) => {
  return fs.promises.readFile(filePath, 'utf-8');
});

// 确保你已注册 IPC 方法：
// ipcMain.handle('save-file-as', async (event, { defaultPath, content }) => {
//   const result = await dialog.showSaveDialog({
//     defaultPath,
//     filters: [{ name: 'Text Files', extensions: ['txt', 'md', 'js', 'ts'] }],
//   });

//   if (!result.canceled && result.filePath) {
//     await fs.promises.writeFile(result.filePath, content, 'utf-8');
//     return { success: true, filePath: result.filePath };
//   } else {
//     return { success: false };
//   }
// });


app.setName('Selene Text'); // ✅ 强制设置 App 名称
let pythonProcess

// 避免  Electron / Chromium 在初始化图形（GPU）渲染环境时的 OpenGL 或 EGL 报错
app.disableHardwareAcceleration(); // 👈 加这一行

const isDev = !app.isPackaged;

function createWindow () {
  console.log("preload.js: ", path.join(__dirname, 'preload.js'));
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,  // ✅ 开启上下文隔离
      nodeIntegration: false,  // ✅ 禁用 Node 集成
      sandbox: false, // ✅ 必须显式关闭 sandbox
    },
  })
  win.webContents.openDevTools();
  

  // if (process.env.NODE_ENV === 'development') {
  if (isDev) {
    win.loadURL('http://localhost:5173'); // ✅ 重要 开发时加载 Vite，本地页面
  } else {
    // 注意这里路径要正确指向 `selene-ui-react` 打包产物
    win.loadFile(path.join(__dirname, 'renderer/index.html'));
  }

  // win.loadFile(path.join(__dirname, 'renderer/index.html'));

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('❌ Failed to load:', validatedURL, errorDescription);
  });
  win.webContents.on('did-finish-load', () => {
    console.log('✅ Page loaded');
  });


  // const menuTemplate = [
  //   createFileMenu(win), // 加载文件菜单
  //   // 你可以继续添加其他模块化菜单：如 Edit、View、Help 等
  // ];
  //
  // const menu = Menu.buildFromTemplate(menuTemplate);
  // Menu.setApplicationMenu(menu);

  const menuTemplate = [];

  // 👇 macOS 特有的 App 菜单（位于左上角）
  if (process.platform === 'darwin') {
    menuTemplate.push(createAppMenu(win));
  }

  // 👇 通用菜单项
  menuTemplate.push(
    createFileMenu(win),
    {
      label: '编辑',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ],
    }
  );

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}



app.whenReady().then(() => {
  console.log('✅ Electron App Ready');
  registerAllIpcHandlers();
  // const venvPythonPath = path.join(__dirname, '../selene-server/.venv/bin/python')  // ⬅️ macOS/Linux

  // 启动 Python 子进程（开发时）
  // pythonProcess = spawn(venvPythonPath, ['../selene-server/main.py'])

  // pythonProcess.stdout.on('data', data => {
  //   console.log(`[python]: ${data}`)
  // })

  // pythonProcess.stderr.on('data', data => {
  //   console.error(`[python error]: ${data}`)
  // })

  createWindow()
})

app.on('will-quit', () => {
  // pythonProcess.kill()
})
