import { Password } from "../../entities/Password";
import { Volume } from "../../entities/Volume";
import { EncryptionService } from "./EncryptionService";
import { PasswordServiceFactory } from "../password/PasswordServiceFactory";

import { log } from "../../utils/LogUtil";
import * as ShellHelper from "../../utils/ShellUtil";

export abstract class EncryptionServiceBase
  implements EncryptionService {
  abstract getMountCMD(volume: Volume, passwordCommand: string): string;
  abstract getUnmountCMD(volume: Volume): string;
  abstract getIsMountedCMD(volume: Volume): string;

  unmount(volume: Volume): void {
    log.debug(`unmounting ${volume.decryptedFolderPath}`);

    if (this.volumeIsMounted(volume)) {
      log.debug(` is mounted and unmounting ${volume.decryptedFolderPath}`);
      console.time();
      ShellHelper.execute(this.getUnmountCMD(volume));
      console.timeEnd();
    } else {
      log.info(`${volume.decryptedFolderPath} not mounted`);
    }
  }

  volumeIsMounted(volume: Volume): boolean {
    log.debug(`checking if "${volume.decryptedFolderPath}" is mounted`);

    let cmd = this.getIsMountedCMD(volume);
    log.debug(`checking if is mounted command: ${cmd}`);

    let [statusCode, stdout, stderr] = ShellHelper.execute(cmd);

    if (statusCode == 0) {
      log.info(`folder [${volume.decryptedFolderPath}] is already mounted`);
      return true;
    } else if (statusCode == 1) {
      log.info(`folder [${volume.decryptedFolderPath}] is NOT mounted`);
      return false;
    } else {
      let msg = `Failed to check is [${volume.decryptedFolderPath}] mounted\n\n return = ${statusCode}\n\n stderr=[${stderr}] \n\n stdout=[${stdout}]`;
      log.error(msg);
      return false;
    }
  }

  mount(volume: Volume, password: Password): void {
    log.debug(
      `about to mount directory [${volume.encryptedFolderPath}] into [${volume.decryptedFolderPath}] with volumeName [${volume.name}]`
    );

    let passwordService = PasswordServiceFactory.create(volume);
    let mountCMD = this.getMountCMD(
      volume,
      passwordService.retrievePasswordCommand(volume)
    );

    log.debug(`mounting command [${mountCMD}]`);

    if (this.volumeIsMounted(volume)) {
      log.info(`${volume.decryptedFolderPath} already mounted`);
    } else {
      log.debug(
        `mounting directory [${volume.encryptedFolderPath}] into [${volume.decryptedFolderPath}] with volumeName [${volume.name}]`
      );
      console.time();
      ShellHelper.execute(mountCMD);
      console.timeEnd();
    }
  }
}
