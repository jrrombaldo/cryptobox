let format = require("string-format");
import * as ShellHelper from "../ShellHelper";
import { log } from "../LogHelper";
import { PasswordManagerOSX } from "../PasswordManagers/PasswordManagerOSX";
import EncryptionManagerBase from "./EncryptionManagerBase";

export class EncryptionManagerOSX extends EncryptionManagerBase {
  MOUNT_CMD: string =
    "{encfs}  {container} {mount_point} --extpass='{password_manager}' --standard --require-macs -ovolname={name} -oallow_root -olocal -ohard_remove -oauto_xattr -onolocalcaches";
  UNMOUNT_CMD: string = "umount {0}";
  IS_MOUNTED_CMD: string = "";

  mount(source: string, destination: string): void {
    log.debug(
      `about to mount directory [${source}] into [${destination}] with volumeName [${this.volumeName}]`
    );

    const passwordManager = new PasswordManagerOSX(source);

    let mountCMD = format(this.MOUNT_CMD, {
      encfs: "encfs",
      idle: 25,
      container: source,
      mount_point: destination,
      password_manager: passwordManager.getPasswordApp(),
      name: this.volumeName
    });

    log.debug(`mounting command [${mountCMD}]`);

    if (this.isMounted(destination)) {
      log.info(`${destination} already mounted`.red);
    } else {
      log.debug(
        `mounting directory [${source}] into [${destination}] with volumeName [${this.volumeName}]`
      );
      console.time();
      ShellHelper.execute(mountCMD);
      console.timeEnd();
    }
  }

  unmount(destination: string): void {
    // destination = checkDir(destination)
    log.debug(`unmounting ${destination}`);

    let unmountCMD = format(this.UNMOUNT_CMD, destination);

    if (this.isMounted(destination)) {
      log.debug(format("unmounting {0} ({1})", destination).grey);
      console.time();
      ShellHelper.execute(unmountCMD);
      console.timeEnd();
    } else {
      log.info(format("{0} not mounted", destination).red);
    }
  }

  isMounted(destination: string): boolean {
    log.debug(`checking if "${destination}" is mounted`);

    let cmd = format("mount | grep -qs '{}' ", destination);
    log.debug(`checking if is mounted command: ${cmd}`);

    let [statusCode, stdout, stderr] = ShellHelper.execute(cmd);

    if (statusCode == 0) {
      log.info(`folder [${destination}] is already mounted`);
      return true;
    } else if (statusCode == 1) {
      log.info(`folder [${destination}] is NOT mounted`);
      return false;
    } else {
      let msg = `Failed to check is [${destination}] mounted\n\n return = ${statusCode}\n\n stderr=[${stderr}] \n\n stdout=[${stdout}]`;
      log.error(msg);
      return false;
    }
  }
}

module.exports = { EncryptionManagerOSX };
