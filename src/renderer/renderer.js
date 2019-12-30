const {ipcRenderer, dialog, window} = require('electron');
log = require('../scripts/LogHelper.js').log;
const constants = require('../constants.js');

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
    var directory = ipcRenderer.sendSync(constants.IPC_GET_DIRECTORY, {});
    if (directory) {
        source.value = directory

        //var passwodExists = ipcRenderer.sendSync(constants.IPC_ACCT_EXISTS, { source: directory })

        //if (passwodExists) {
        //    passwordDiv.disabled = true
        //    password.value = ""
        //}


    }
};

destination.onclick = () => {
    var directory = ipcRenderer.sendSync(constants.IPC_GET_DIRECTORY, {});
    if (directory) {
        destination.value = directory
        //    updateMountBtn()
    }
};

cloudEncForm.onsubmit = () => {
    log.debug(`source:${source.value}  destination:${destination.value}  volume:${volumeName.value}`);
    var args = {
        source: source.value,
        destination: destination.value,
        volumeName: volumeName.value,
    };
    var result = ipcRenderer.sendSync(constants.IPC_MOUNT_UNMOUNT, args);
    log.info(`here is the ${result}`);
    updateMountBtn();
    // notify(result+" with success")

    // avoid the form to reload
    return false
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


// // ======  reading directories with native dialog, to avoid security issues with browsers
// destination.onclick = () => {
//     var dir = ipcRenderer.sendSync("get_direcotry_natively", {})
//     log.debug(`destination=${dir}`)
//     if (dir) {
//         destination.value = dir
//         updateBtn()
//     }
// }


// function updateBtn() {
//     console.log("updating mount/unmont button")
//     var mounted = ipcRenderer.sendSync("is_mounted", { destination: destination.value })
//     if (mounted)
//         mountBtn.innerText = "UnMount"
//     else
//         mountBtn.innerText = "Mount"
// }


// // ======  reading directories with native dialog, to avoid security issues with browsers
// source.onclick = () => {
//     // ipcRenderer.send('put-in-tray')

//     var dir = ipcRenderer.sendSync("get_direcotry_natively", {})
//     if (dir) {
//         source.value = dir
//         var reuse = ipcRenderer.sendSync("account_exists_reuse", { source: dir, destination: dir })
//         log.debug(`account exists:${reuse}`)
//         if (reuse) {
//             passwordDiv.disabled = true
//             password.value = ""
//         }
//         else {
//             passwordDiv.disabled = false
//         }
//     }
// }

// // ======  reading directories with native dialog, to avoid security issues with browsers
// destination.onclick = () => {
//     var dir = ipcRenderer.sendSync("get_direcotry_natively", {})
//     log.debug(`destination=${dir}`)
//     if (dir) {
//         destination.value = dir
//         updateBtn()
//     }
// }


// cloudEncForm.onsubmit = ()=>{
//     log.debug(`source:${source.value}  destination:${destination.valu}  volume:${volumeName.value}`)
//     var args = {
//         source: source.value,
//         destination: destination.value,
//         volumeName: volumeName.value,
//     }
//     var result = ipcRenderer.sendSync("mount_unmount", args)
//     updateBtn();
//     notify(result+" with success")

//     // avoid the form to reload
//     return false
// }


// // var volumeName = document.getElementById("volumeName").value
// // var password = document.getElementById("password").value
// // var destination = document.getElementById("encfsFolder").value
// // var status = document.getElementById("statusLbl")

// // console.log(document.getElementById("clearFolder").value)
// // notify(source)

// // var replay = ipcRenderer.sendSync("account_exists", { source: source, destination: destination })
// // console.log(replay)
// // status.innerHTML = replay

// // notify(replay)


// // var replay = ipcRenderer.sendSync("set_keychain_password", {password:"test123", "volumeName":"volTest"})
// // console.log(replay)
// // if (source === '' || !source) {
// //     status.innerHTML = "Unecrypted folder required"
// //     return;
// // }
// // if (destination === '' || !destination) {
// //     status.innerHTML = "Ecrypted folder required"
// //     return;
// // }

// // console.log


// function notify(title = "CloudEnc", message) {
//     const notification = {
//         title: title,
//         body: message,
//         silent: true,
//         icon: './resources/cloud-enc2.ico'
//     }
//     const myNotification = new window.Notification(notification.title, notification)

//     myNotification.onclick = () => {
//         console.log('Notification clicked')
//     }
// }
