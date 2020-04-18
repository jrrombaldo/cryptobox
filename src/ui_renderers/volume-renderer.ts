import { ipcRenderer } from "electron";
import { constants } from "../utils/constants";
import log from "../utils/LogUtil";

// const { ipcRenderer } = require("electron");
// const constants = require("../utils/constants");
// const log = require("../utils/LogUtil").log;
// const path = require('path')
// var UIHelper = require("../controllers/UIHelper.ts");

log.debug("volume-rendered starting ...");

var source: HTMLElement = document.getElementById("source");
var cloudEncForm = document.getElementById("cloudEncForm");
var mountBtn = document.getElementById("mountBtn");

source.onclick = () => {
  log.debug(
    `IPC source folder requesting a native directory browser -> ${constants.IPC_GET_DIRECTORY}`
  );
  const directory = ipcRenderer.sendSync(constants.IPC_GET_DIRECTORY, {});
  if (directory) {
    log.debug("directory: ", directory);
    source.textContent = directory;
    log.debug("source.innerText: ", source.textContent);
    checkIfPasswordExist(source.textContent);
    updateMountBtn();
  }
};

cloudEncForm.onsubmit = () => {
  log.debug("form submit");
  const args = {
    source: source.textContent,
  };
  log.debug(`IPC requesting to mount/umount ${source.textContent}`);
  const response = ipcRenderer.sendSync(constants.IPC_MOUNT_UNMOUNT, args);
  log.info(`IPC here is the result ${JSON.stringify(response)}`);
  updateMountBtn();

  // notify(response.message)
  ipcRenderer.sendSync(constants.IPC_NOTIFICATION, {
    message: response.message,
  });

  return false;
};

function updateMountBtn() {
  const resp = ipcRenderer.sendSync(constants.IPC_IS_MOUNTED, {
    source: source.textContent,
  });

  mountBtn.innerText = resp.isMounted ? "UNmount" : "Mount";
}

function checkIfPasswordExist(source: string): void {
  const ret = ipcRenderer.sendSync(constants.IPC_PASSWORD_EXIST, {
    source: source,
  });
  log.debug("IPC check if password exist", ret);
}

// function notify(message) {
//     const myNotification =
//         new window.Notification(constants.WINDOWS_TITLE, {
//             body: message,
//             silent: true,
//             icon: path.join(__dirname, "../../static/resources/cloud-enc.png")
//         });

//     myNotification.onclick = () => {
//         console.log('Notification clicked')
//     }
// }
