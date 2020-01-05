const PasswordManager = require("../PasswordManager");
const format = require("string-format");
const ShellHelper = require("./../ShellHelper");

// TODO: implement class correctly (currently it is a copy of EncryptionManagerOSX)
class EncryptionManagerLinux {
  MOUNT_CMD =
    "{encfs} {container} {mountPoint} --standard --extpass='{passwordManager}' --require-macs -ohard_remove --idle={idleMinutesToUnmount}";
  UNMOUNT_CMD = "umount {0}";
  IS_MOUNTED_CMD = "";

  mount(source, destination, volumeName) {
    // destination = checkDir(destination)
    // source = checkDir(source)
    log.debug(`about to mount directory [${source}] into [${destination}]`);

    const mountCMD = format(this.MOUNT_CMD, {
      encfs: "encfs",
      mountPoint: destination,
      container: source,
      idleMinutesToUnmount: 25,
      passwordManager: "cat ~/cryptobox/pass.txt" //TODO: Replace by a password manager
      // name: volumeName
    });

    log.debug(`mounting command [${mountCMD}]`);

    // if (!volumeName)
    //   volumeName = path.basename(source).concat(constants.VOLUME_NAME_SUFIX);

    if (this.isMounted(destination)) {
      log.info(`${detination} already mounted`.red);
    } else {
      log.debug(`mounting directory [${source}] into [${destination}]`);
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

module.exports = EncryptionManagerLinux;
