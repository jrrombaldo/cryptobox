const { ipcMain } = require("electron");
const os = require("os");
const colors = require("colors");
const constants = require("../constants");
var log = require("./LogHelper.js").log;
var PasswordManager = require("./PasswordManager.js");
var UIHelper = require("./UIHelper.js");
// var EncryptionManager = require('./EncryptionManager.js');
const encryptionManagerFactory = require("./EncryptionManagers/EncryptionManagerFactory");

ipcMain.on(constants.IPC_GET_DIRECTORY, (event, arg) => {
  var directory = UIHelper.getDirectoryNatively();
  if (directory) event.returnValue = directory[0];
  else event.returnValue = null;
});

ipcMain.on(constants.IPC_ACCT_EXISTS, (event, arg) => {
  var source = arg["source"];
  log.info(`cheking if password exists for source folder: [${source}]`);

  if (!source || source === "") {
    log.error(`missing source folder [${source}]`.red);
  }

  var pm = new PasswordManager(source);
  var password = pm.searchForPassword();

  if (password) {
    event.returnValue = !!UIHelper.confirmPasswordUse();
  } else {
    log.info(`password not found for ${source}`);
    event.returnValue = false;
    // TODO create password
  }
});

ipcMain.on(constants.IPC_IS_MOUNTED, (event, arg) => {
  var destination = arg["destination"];
  log.info(`check if ${destination} is mounted`);

  //   var encMngr = new EncryptionManager();
  const encryptionManager = encryptionManagerFactory.create(os.platform());
  var mounted = encryptionManager.isMounted(destination);
  if (mounted) event.returnValue = true;
  else event.returnValue = false;
});

ipcMain.on(constants.IPC_MOUNT_UNMOUNT, (event, arg) => {
  var source = arg["source"];
  var destination = arg["destination"];
  var volumeName = arg["volumeName"];

  log.info(
    `mount/unmount on source: [${source}], destination: [${destination}], volumenName: [${volumeName}]`
  );

  //   var encMngr = new EncryptionManager();
  const encMngr = encryptionManagerFactory.create(os.platform());

  if (!encMngr.isMounted(destination)) {
    log.log(`{destination} is not mounted, mounting`);
    encMngr.mount(source, destination, volumeName);
    log.log(`${source} -> ${destination} mounted with success`);
    event.returnValue = "Mounted";
  } else {
    log.log(`${destination} is  mounted, umounting`);
    encMngr.unmount(destination);
    log.log(`${destination} unounted with success`);
    event.returnValue = "Unmounted";
  }
});