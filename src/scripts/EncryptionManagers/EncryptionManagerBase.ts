import { log } from "../LogHelper";
import * as ShellHelper from "../ShellHelper";
import { PasswordManagerFactory } from "../PasswordManagers/PasswordManagerFactory";

export default abstract class EncryptionManagerBase {
  volumeName: string = "cryptobox";
  idleTimeout: number = 25;

  setVolumeNme(source: string): void {
    // this.volumeName = path.basename(source).concat(constants.VOLUME_NAME_SUFIX);
    this.volumeName = "cryptobox";
  }

  abstract getMountCMD(source: string, destination: string, passwordManager: string): string;
  abstract getUmountCMD(destination: string): string;
  abstract getIsMountedCMD(destination: string): string;

  unmount(destination: string): void {
    log.debug(`unmounting ${destination}`);

    if (this.isMounted(destination)) {
      log.debug(` is mounted and unmounting ${destination}`);
      console.time();
      ShellHelper.execute(this.getUmountCMD(destination));
      console.timeEnd();
    } else {
      log.info(`${destination} not mounted`);
    }
  }

  isMounted(destination: string): boolean {
    log.debug(`checking if "${destination}" is mounted`);

    let cmd = this.getIsMountedCMD(destination);
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

  mount(source: string, destination: string): void {
    log.debug(
      `about to mount directory [${source}] into [${destination}] with volumeName [${this.volumeName}]`
    );

    let passwordManager = PasswordManagerFactory.create(source);
    let mountCMD = this.getMountCMD(source, destination, passwordManager.getPasswordApp());

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
}

