const {ipcRenderer, dialog, window} = require('electron');
const log = require('../utils/LogUtil').log;
const constants = require('../utils/constants');

log.debug("volume-rendered starting ...")

var source = document.getElementById('source');
var destination = document.getElementById('destination');
var passwordDiv = document.getElementById('passwordDiv');
var password = document.getElementById('password');
var volumeName = document.getElementById('volumeName');
var status = document.getElementById('statusLbl');
var cloudEncForm = document.getElementById('cloudEncForm');
var mountBtn = document.getElementById('mountBtn');

var mounted = false;

function updateMountBtn() {
    var mounted = ipcRenderer.sendSync(constants.IPC_IS_MOUNTED, {destination: destination.value});
    if (mounted)
        mountBtn.innerText = "Dismount";
    else
        mountBtn.innerText = "Mount"
}

source.onclick = () => {
    log.debug(`source folder requesting a native directory browser -> ${constants.IPC_GET_DIRECTORY}`)
    var directory = ipcRenderer.sendSync(constants.IPC_GET_DIRECTORY, {});
    if (directory) {
        source.value = directory;
    }
};

// destination.onclick = () => {
//     var directory = ipcRenderer.sendSync(constants.IPC_GET_DIRECTORY, {});
//     if (directory) {
//         destination.value = directory
//         //    updateMountBtn()
//     }
// };

cloudEncForm.onsubmit = () => {
    log.debug("form submit")

    
    // log.debug(`source:${source.value}  destination:${destination.value}  volume:${volumeName.value}`);
    // var args = {
    //     source: source.value,
    //     destination: destination.value,
    //     volumeName: volumeName.value,
    // };
    // var result = ipcRenderer.sendSync(constants.IPC_MOUNT_UNMOUNT, args);
    // log.info(`here is the ${result}`);
    // updateMountBtn();
    // // notify(result+" with success")

    // // avoid the form to reload
    // return false
};

function notify(title = "CloudEnc", message) {
    const notification = {
        title: title,
        body: message,
        silent: true,
        icon: './resources/cloud-enc2.ico'
    };
    const myNotification = new window.Notification(notification.title, notification);

    myNotification.onclick = () => {
        console.log('Notification clicked')
    }
}
