import { Password } from "../../entities/Password";
import { Volume } from "../../entities/Volume";
import { PasswordServiceBase } from "./PasswordServiceBase";
import { PasswordService } from "./PasswordService";

import * as constants from "../../utils/constants";

import { log } from "../../utils/LogUtil";
import * as ShellHelper from "../../utils/ShellUtil";

export class PasswordServiceOSX extends PasswordServiceBase
  implements PasswordService {

  getKeychainService(volume: Volume): string {
    return `cryptobox://${volume.encryptedFolderPath}`;
  }

  retrievePasswordCommand(volume: Volume): string {
    let service = this.getKeychainService(volume);
    return `security find-generic-password  -a "${constants.OSX_KEYCHAIN_ACCOUNT}" -s "${service}" -w `;
  }

  searchForPassword(password: Password, volume: Volume): string {
    log.info(`searching password for ${password.passwordManagerRef}`);

    let command = this.retrievePasswordCommand(volume);

    let [result, stdout, stderr] = ShellHelper.execute(command, true);

    if (result === 0) return stdout;
    if (result === 44)
      // not found
      return null;
    if (result === 0) {
      log.error(`unknown error when searching password`);
      return null;
      // throw new Error(stderr)
    }
  }

  saveNewPassword(password: Password, volume: Volume): void {
    log.info(`saving password for ${password.passwordManagerRef}`);

    let comment = "Created by cryptobox @ $( date +'%Y.%m.%d-%H:%M')";

    let service = this.getKeychainService(volume);

    let command = `security add-generic-password -a '${constants.OSX_KEYCHAIN_ACCOUNT}' -s '${service}' -D 'application password' -j \"${comment}\" -w'${password.passwordValue}' -U`;
    let result = ShellHelper.execute(command);
    // TODO parse the result and validate
  }
}

module.exports = { PasswordServiceOSX };
