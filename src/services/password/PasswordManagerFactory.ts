import { EncryptionManagerOSX } from "../encryption/EncryptionServiceOSX";
import { EncryptionManagerLinux } from "../encryption/EncryptionServiceLinux";

import { PasswordManagerOSX } from './PasswordManagerOSX';
import { PasswordManagerLinux } from './PasswordManagerLinux';

const os = require("os");

export class PasswordManagerFactory {
  public static create(source: string) {
    const managers = this.getManagers();
    if (!(os.platform() in managers)) {
      throw new Error(
        `The platform ${os.platform()} is not currently supported.`
      );
    }
    let manager = managers[os.platform()];
    return new manager(source);
  }

  private static getManagers(): any {
    return {
      darwin: PasswordManagerOSX,
      linux: PasswordManagerLinux
    };
  }
}

// module.exports = PasswordManagerFactory;
