const { ipcRenderer } = require('electron');
const log = require('../utils/LogUtil').log;
const constants = require('../utils/constants');
const path = require('path')


log.debug("volume-rendered starting ...")

var source = document.getElementById('source');
var cloudEncForm = document.getElementById('cloudEncForm');
var mountBtn = document.getElementById('mountBtn');



source.onclick = () => {
    log.debug(`IPC source folder requesting a native directory browser -> ${constants.IPC_GET_DIRECTORY}`)
    var directory = ipcRenderer.sendSync(constants.IPC_GET_DIRECTORY, {});
    if (directory) {
        source.value = directory;
        updateMountBtn();
    }
};


cloudEncForm.onsubmit = () => {
    log.debug("form submit")
    var args = {
        source: source.value,
    };
    log.debug(`IPC requesting to mount/umount ${source.value}`)
    var response = ipcRenderer.sendSync(constants.IPC_MOUNT_UNMOUNT, args);
    log.info(`IPC here is the result ${JSON.stringify(response)}`);
    updateMountBtn();

    notify(response)

    return false
};

constants.WINDOWS_TITLE
function notify(response) {
    // if (!response) { return }

    const myNotification =
        new window.Notification(constants.WINDOWS_TITLE, {
            body: response.message,
            silent: true,
            icon: path.join(__dirname, "../../static/resources/cloud-enc.png")
        });

    myNotification.onclick = () => {
        console.log('Notification clicked')
    }
}

function updateMountBtn() {
    var resp = ipcRenderer.sendSync(constants.IPC_IS_MOUNTED, { source: source.value });

    if (resp.isMounted )
        mountBtn.innerText = "UNmount";
    else
        mountBtn.innerText = "Mount"
}



// let response = {
//     "status": "test"
// }
// notify(response)

// function notify(title = "CloudEnc", message) {
//     const notification = {
//         title: title,
//         body: message,
//         silent: true,
//         icon: './resources/cloud-enc2.ico'
//     };
//     const myNotification = new window.Notification(notification.title, notification);

//     myNotification.onclick = () => {
//         console.log('Notification clicked')
//     }
// }
