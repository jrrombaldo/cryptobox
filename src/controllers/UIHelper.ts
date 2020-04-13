import { Volume } from "../entities/Volume";

const { dialog, BrowserWindow, Notification } = require('electron');
var path = require("path");
const constants = require("../utils/constants");
var log = require("../utils/LogUtil").log;


function notify(message: string) {
    log.info("is notification supported ", Notification.isSupported()) // TODO do something with it 

    let myNotification = new Notification({
        title: constants.WINDOWS_TITLE,
        // subtitle: "testing subtitle",
        body: message,
        silent : true,
        icon: path.join(__dirname, "../../static/resources/cloud-enc.png")
    });

    myNotification.show();
    // const myNotification =
    //     new window.Notification(constants.WINDOWS_TITLE, {
    //         body: message,
    //         silent: true,
    //         icon: path.join(__dirname, "../../static/resources/cloud-enc.png")
    //     });

    // myNotification.onclick = () => {
    //     console.log('Notification clicked')
    // }
}


function getDirectoryNatively() {
    var directory = dialog.showOpenDialogSync({ properties: ['openDirectory'] });
    log.info(`getDirectoryNatively result: [${directory}]`);
    return directory
}


function passwordPrompt(volume: Volume) {
    log.debug("rendering password prompt modal...")
    let activeWindow = BrowserWindow.getAllWindows()[0] // TODO will fail if there is more than one window
    console.log(activeWindow.getSize())

    let promptWindow = new BrowserWindow({
        width: activeWindow.getSize()[0] * 0.8,
        height: activeWindow.getSize()[1] * 0.9,
        'parent': activeWindow,
        'show': false,
        'modal': true, // disable for a floating popup
        'alwaysOnTop': true,
        'title': "Provide a Password...",
        'autoHideMenuBar': true,
        'webPreferences': {
            "nodeIntegration": true,
            "sandbox": false,
            "additionalArguments": [volume.encryptedFolderPath]
        }
    });


    // runs after the IPC, so it can return.
    promptWindow.on('closed', () => {
        promptWindow = null
    })

    // enable debug
    // promptWindow.webContents.openDevTools();

    // Load the HTML dialog box
    promptWindow.loadFile(path.join(__dirname, "../../static/ui/password.html"), { query: { "source": volume.encryptedFolderPath } })
    promptWindow.once('ready-to-show', () => {
        log.debug("password prompt ready to show ...")
        promptWindow.show()
    })

}

module.exports = {
    getDirectoryNatively,
    notify,
    passwordPrompt,
};