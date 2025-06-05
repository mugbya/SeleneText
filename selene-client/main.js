// electron/main.js
const { app, BrowserWindow } = require('electron')
const path = require('path')
const { spawn } = require('child_process')

let pythonProcess

// 避免  Electron / Chromium 在初始化图形（GPU）渲染环境时的 OpenGL 或 EGL 报错
app.disableHardwareAcceleration(); // 👈 加这一行

function createWindow () {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
      nodeIntegration: true,
    },
  })
  win.webContents.openDevTools();
  win.loadURL('http://localhost:5173') // ✅ 重要 开发时加载 Vite，本地页面
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('❌ Failed to load:', validatedURL, errorDescription);
  });
  win.webContents.on('did-finish-load', () => {
    console.log('✅ Page loaded');
  });
  // 打包后这样写：win.loadFile(path.join(__dirname, '../dist/index.html'))
}

app.whenReady().then(() => {
  console.log('✅ Electron App Ready');
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