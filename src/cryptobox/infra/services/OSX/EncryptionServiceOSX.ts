import { EncryptionService } from "../../../domain/services/EncryptionService";
import { Volume } from "../../../domain/aggregates/Volume";
import { PasswordService } from "../../../domain/services/PasswordService";
import * as shelljs from "shelljs";
import { info, error } from "electron-log";

export class EncryptionServiceOSX implements EncryptionService {
  public mount(volume: Volume, passwordService: PasswordService): void {
    const pwdCommand: string = passwordService.retrievePasswordCommand(volume);
    let command: string = `encfs ${volume.encryptedFolderPath} ${volume.decryptedFolderPath}`;
    command = `${command} --extpass='${pwdCommand}' --idle=`;
    command = `${command} --standard --require-macs -ovolname=${volume.name}`;
    command = `${command} -oallow_root -olocal -ohard_remove -oauto_xattr -onolocalcaches`;
    shelljs.exec(command, { silent: false });
  }

  public unmount(volume: Volume): void {
    const command: string = `umount ${volume.decryptedFolderPath}`;
    shelljs.exec(command, { silent: false });
  }

  public volumeIsMounted(volume: Volume): boolean {
    const command: string = `mount | grep -qs '${volume.decryptedFolderPath}'`;
    const results: any = shelljs.exec(command, {
      silent: false
    });
    if (results.statusCode == 0) {
      info(`folder [${volume.decryptedFolderPath}] is already mounted`);
      return true;
    } else if (results.statusCode == 1) {
      info(`folder [${volume.encryptedFolderPath}] is NOT mounted`);
      return false;
    } else {
      const msg = `Failed to check is [${volume.decryptedFolderPath}] mounted\n\n return = ${results.statusCode}\n\n stderr=[${results.stderr}] \n\n stdout=[${results.stdout}]`;
      error(msg);
      return false;
    }
  }
}
