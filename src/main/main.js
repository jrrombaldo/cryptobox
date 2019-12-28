const { app, BrowserWindow } = require('electron')
const { Menu } = require('electron')
const { Tray } = require('electron')

const fs = require("fs");
const path = require('path')


log = require('../scripts/LogHelper.js').log

// auto update
require('update-electron-app')({ logger: log })


let mainWindow
let appIcon = null
const icoPath = './static/resources/elec.icns'
const icoPathPNG = './static/resources/cloud-enc.png'
const trayIcon = '../../static/resources/example.png'

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 800,
        height: 360,
        // frame: false,
        fullscreenable: false,
        resizable: true,
        icon: path.join(__dirname, icoPath),
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.setVisibleOnAllWorkspaces(true);
    mainWindow.loadFile('./static/ui/index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function () {
        mainWindow = null
    })

    mainWindow.on('unresponsive', function (){
        log.info("unresponsive, response to be implemented ...")
    })
}

function createTray() {
    // const { Tray } = require('electron')
    appIcon = new Tray(path.join(__dirname,trayIcon))
    // appIcon = new Tray(path.join(__dirname, 'resources/cloud-enc.png'))

    const trayMenu = Menu.buildFromTemplate([{
        label: "Cryptobox",
        click: () => { console.log("tray menu clicked") }
    }])
    appIcon.setTitle("Cryptobox")
    appIcon.setContextMenu(trayMenu)


  // const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'example.png'
  // const iconPath = path.join("/Users/junior/dev/repos/cloud-enc/resources", iconName)
  // appIcon = new Tray(iconPath)
  //
  // const contextMenu = Menu.buildFromTemplate([{
  //   label: 'Remove',
  //   click: () => {
  //     event.sender.send('tray-removed')
  //   }
  // }])
  //
  // appIcon.setToolTip('Electron Demo in the tray.')
  // appIcon.setContextMenu(contextMenu)
}

app.on('ready', () => {
    loadScripts();
    createTray();
    createWindow();
});

//  ensure the app is closed when the main window is closed
app.on('window-all-closed', function () {
    // if (process.platform !== 'darwin') app.quit()
    if (appIcon) appIcon.destroy()
    app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})



// log.catchErrors(options = {});
process.on('uncaughtException', function (error) {
    console.log("UNCATCH EXCEPTION FOUND ")
    console.log(error)
})



function loadScripts() {
    const scripts = fs.readdirSync("./src/scripts")
    scripts.forEach(script => {
        script.endsWith(".js") && require("../scripts/" + script) 
        && log.debug(`imported: ${script} `)
    });
}
