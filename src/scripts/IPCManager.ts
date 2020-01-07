import { ipcMain } from "electron";
// const colors = require("colors");
import * as constants from "../constants";
import { getDirectoryNatively, confirmPasswordUse } from "./UIHelper.js";
import { info, error, log } from "electron-log";
import { Volume } from "../cryptobox/domain/aggregates/Volume";
import { EncryptionServiceFactory } from "../cryptobox/infra/factories/EncryptionServiceFactory";
import { MountVolume } from "../cryptobox/application/MountVolume";
import { UnmountVolume } from "../cryptobox/application/UnmountVolume";
// var log = require("./LogHelper.js").log;
// var PasswordManager = require("./PasswordManager.js");

ipcMain.on(constants.IPC_GET_DIRECTORY, (event, arg) => {
  var directory = getDirectoryNatively();
  if (directory) event.returnValue = directory[0];
  else event.returnValue = null;
});

ipcMain.on(constants.IPC_ACCT_EXISTS, (event, arg) => {
  var source = arg["source"];
  info(`checking if password exists for source folder: [${source}]`);

  if (!source || source === "") {
    error(`missing source folder [${source}]`.red);
  }

  let password = null;

  if (os.platform() === "darwin") {
    var pm = new PasswordManager(source);
    password = pm.searchForPassword();
  } else if (os.platform() === "linux") {
    password = "12345"; // forced password while Linux password manager is not defined
  }

  if (password) {
    event.returnValue = !!confirmPasswordUse();
  } else {
    info(`password not found for ${source}`);
    event.returnValue = false;
    // TODO create password
  }
});

ipcMain.on(constants.IPC_IS_MOUNTED, (event, arg) => {
  var destination = arg["destination"];
  info(`check if ${destination} is mounted`);
  const volume = new Volume();

  const encryptionService = EncryptionServiceFactory.create();
  const mounted = encryptionService.volumeIsMounted(volume);
  if (mounted) event.returnValue = true;
  else event.returnValue = false;
});

ipcMain.on(constants.IPC_MOUNT_UNMOUNT, (event, arg) => {
  const volume = new Volume();
  volume.encryptedFolderPath = arg["source"];
  volume.decryptedFolderPath = arg["destination"];
  volume.name = arg["volumeName"];
  volume.timeToUnmount = 25;

  info(
    `mount/unmount on source: [${volume.encryptedFolderPath}], destination: [${volume.decryptedFolderPath}], volumenName: [${volume.name}]`
  );

  const encryptionService = EncryptionServiceFactory.create();
  const passwordService = PasswordServiceFactory.create();

  if (!encryptionService.volumeIsMounted(volume)) {
    log(`${volume.decryptedFolderPath} is not mounted, mounting`);
    const mountVolume = new MountVolume(
      volume,
      encryptionService,
      passwordService
    );
    mountVolume.run();
    log(mountVolume.response);
    event.returnValue = "Mounted";
  } else {
    log(`${volume.decryptedFolderPath} is  mounted, umounting`);
    const unmountVolume = new UnmountVolume(volume, encryptionService);
    unmountVolume.run();
    log(unmountVolume.response);
    event.returnValue = "Unmounted";
  }
});
