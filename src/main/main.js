const {app, BrowserWindow} = require('electron');
const {Menu} = require('electron');
const {Tray} = require('electron');

const fs = require("fs");
const path = require('path');

log = require('../scripts/LogHelper.js').log;

require('update-electron-app')({logger: log});

let mainWindow;
let appIcon = null;
const icoPath = './static/resources/elec.icns';
const icoPathPNG = './static/resources/cloud-enc.png';
const trayIcon = '../../static/resources/example.png';

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 800,
        height: 360,
        fullscreenable: false,
        resizable: true,
        icon: path.join(__dirname, icoPath),
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.setVisibleOnAllWorkspaces(true);
    mainWindow.loadFile('./static/ui/index.html');

    mainWindow.on('closed', function () {
        mainWindow = null
    });

    mainWindow.on('unresponsive', function () {
        log.info("unresponsive, response to be implemented ...")
    })
}

function createTray() {
    // const { Tray } = require('electron')
    appIcon = new Tray(path.join(__dirname, trayIcon));
    // appIcon = new Tray(path.join(__dirname, 'resources/cloud-enc.png'))

    const trayMenu = Menu.buildFromTemplate([{
        label: "Cryptobox",
        click: () => {
            console.log("tray menu clicked")
        }
    }]);
    appIcon.setTitle("Cryptobox");
    appIcon.setContextMenu(trayMenu)
}

app.on('ready', () => {
    loadScripts();
    createTray();
    createWindow();
});

app.on('window-all-closed', function () {
    if (appIcon) appIcon.destroy();
    app.quit()
});

app.on('activate', function () {
    if (mainWindow === null) createWindow()
});

process.on('uncaughtException', function (error) {
    console.log("UNCATCH EXCEPTION FOUND ");
    console.log(error)
});

function loadScripts() {
    const scripts = fs.readdirSync("./src/scripts");
    scripts.forEach(script => {
        script.endsWith(".js") && require("../scripts/" + script)
        && log.debug(`imported: ${script} `)
    });
}