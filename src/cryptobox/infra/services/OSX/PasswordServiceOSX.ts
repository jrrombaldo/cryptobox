import { PasswordService } from "../../../domain/services/PasswordService";
import { Volume } from "../../../domain/aggregates/Volume";
import * as shelljs from "shelljs";
import { info, error } from "electron-log";

export class PasswordServiceOSX implements PasswordService {
  OSX_KEYCHAIN_SERVICE: string;

  constructor() {
    this.OSX_KEYCHAIN_SERVICE = "cryptobox";
  }

  public retrievePasswordCommand(volume: Volume): string {
    const accountName = this.getAccountName(volume);
    const serviceName = this.OSX_KEYCHAIN_SERVICE;
    return `security find-generic-password  -a "${accountName}" -s "${serviceName}" -w`;
  }

  public saveNewPassword(volume: Volume): string {
    //TODO: implement method
    //command: "security add-generic-password -a '{account}' -s '{service}' -D 'application password' -j \"{comment}\" -w'{password}' -U";
    return "new password saved";
  }

  private getAccountName(volume: Volume): string {
    return `${this.OSX_KEYCHAIN_SERVICE}:${volume.encryptedFolderPath}`;
  }

  public searchForPassword(volume: Volume): string | null {
    info(`searching password for ${this.getAccountName(volume)}`);

    const command = this.retrievePasswordCommand(volume);

    const results: any = shelljs.exec(command, { silent: true });
    // var [result, stdout, stderr] =

    if (results.statusCode === 0) return results.stdout;
    if (results.statusCode === 44)
      // not found
      return null;
    if (results.statusCode === 0) {
      error(`unknonw error when searching password`);
      return null;
      // throw new Error(stderr)
    }
  }
}
