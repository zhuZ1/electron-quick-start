// Modules to control application life and create native browser window
const {app, BrowserWindow, autoUpdater, dialog} = require('electron')
// require('update-electron-app')()  // 更新应用程序
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  mainWindow.webContents.openDevTools({mode:'right'})

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 检查更新
app.on('ready', function () {
  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 60000)
})

app.on('checking-for-update', () => {
  console.log('开始检查更新了')
}) 

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// 使用update.electronjs.org
  // 公开的github仓库
  // 发布github releases
  // 编译的版本已代码签名
// electron-release-server  部署更新服务器的方式
// 根据electron-is-dev检查当前环境
// 构建更新服务器的url并且通知 autoUpdater

const server = 'https://electron-quick-start.vercel.app'
const url = `${server}/update/${process.platform}/${app.getVersion()}`

autoUpdater.setFeedURL({ url })



// 自动更新
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
})

autoUpdater.on('error', message => {
  console.error('There was a problem updating the application')
  console.error(message)
})




// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
