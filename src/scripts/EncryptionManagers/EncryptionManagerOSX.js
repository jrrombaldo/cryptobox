const PasswordManager = require("../../scripts/PasswordManagers/PasswordManagerOSX.js");
const format = require("string-format");
const ShellHelper = require("./../ShellHelper");

class EncryptionManagerOSX {

  MOUNT_CMD = "{encfs}  {container} {mount_point} --extpass='{password_manager}' --standard --require-macs -ovolname={name} -oallow_root -olocal -ohard_remove -oauto_xattr -onolocalcaches";
  UNMOUNT_CMD = "umount {0}";
  IS_MOUNTED_CMD = "";

  mount(source, destination, volumeName) {
    // destination = checkDir(destination)
    // source = checkDir(source)
    log.debug(
      `about to mount directory [${source}] into [${destination}] with volumeName [${volumeName}]`
    );
    
    var passwordManager = new PasswordManager(source);

    var mountCMD = format(this.MOUNT_CMD, {
      encfs: "encfs",
      idle: 25,
      container: source,
      mount_point: destination,
      password_manager: passwordManager.getPasswordApp(),
      name: volumeName
    });

    log.debug(`mounting command [${mountCMD}]`);

    if (!volumeName)
      volumeName = 'Cryptobox';
      //volumeName = path.basename(source).concat(constants.VOLUME_NAME_SUFIX);

    if (this.isMounted(destination)) {
      log.info(`${detination} already mounted`.red);
    } else {
      log.debug(
        `mounting directory [${source}] into [${destination}] with volumeName [${volumeName}]`
      );
      console.time();
      ShellHelper.execute(mountCMD);
      console.timeEnd();
    }
  }

  unmount(destination) {
    // destination = checkDir(destination)
    log.debug(`unmounting ${destination}`);

    var unmountCMD = format(this.UNMOUNT_CMD, destination);

    if (this.isMounted(destination)) {
      log.debug(format("unmounting {0} ({1})", destination).grey);
      console.time();
      ShellHelper.execute(unmountCMD);
      console.timeEnd();
    } else {
      log.info(format("{0} not mounted", destination).red);
    }
  }

  isMounted(destination) {
    // destination = checkDir(destination)
    log.debug(`checking if "${destination}" is mounted`);

    var cmd = format("mount | grep -qs '{}' ", destination);
    log.debug(`checking if is mounted command: ${cmd}`);

    var [statusCode, stdout, stderr] = ShellHelper.execute(cmd);

    if (statusCode == 0) {
      log.info(`folder [${destination}] is already mounted`);
      return true;
    } else if (statusCode == 1) {
      log.info(`folder [${destination}] is NOT mounted`);
      return false;
    } else {
      var msg = `Failed to check is [${destination}] mounted\n\n return = ${statusCode}\n\n stderr=[${stderr}] \n\n stdout=[${stdout}]`;
      log.error(msg);
      return false;
    }
  }
}

module.exports = EncryptionManagerOSX;
