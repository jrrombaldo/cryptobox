import { Password } from "../../entities/Password";
import { Volume } from "../../entities/Volume";
import { PasswordServiceBase } from "./PasswordServiceBase";
import { PasswordService } from "./PasswordService";

import { log } from "../../utils/LogUtil";
import * as ShellHelper from "../../utils/ShellUtil";

export class PasswordServiceLinux extends PasswordServiceBase
  implements PasswordService {
  // PASS_CRYPTOBOX_FOLDER = "cryptobox";

  retrievePasswordCommand(volume: Volume): string {
    return "cat /tmp/cryptobox/pass.txt";
  }

  searchForPassword(password: Password, volume: Volume): string | null {
    log.info(`searching password for ${password.passwordManagerRef}`);
    return "";
  }

  saveNewPassword(password: Password): void {
    log.info(`saving password for ${password.passwordManagerRef}`);
  }
}

module.exports = { PasswordServiceLinux };
