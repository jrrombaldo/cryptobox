import { Volume } from "../../entities/Volume";
import { PasswordService } from "./PasswordService";
import { PasswordServiceOSX } from "./PasswordServiceOSX";
import { PasswordServiceLinux } from "./PasswordServiceLinux";

const os = require("os");

export class PasswordServiceFactory {
  public static create(): PasswordService {
    const managers: {[platform: string] : PasswordService} = this.getManagers();
    if (!(os.platform() in managers)) {
      throw new Error(
        `The platform ${os.platform()} is not currently supported.`
      );
    }
    let manager = managers[os.platform()];
    return manager;
  }

  private static getManagers(): {[platform: string] : PasswordService} {
    return {
      'darwin': new PasswordServiceOSX,
      'linux': new PasswordServiceLinux
    };
  }
}

module.exports = {PasswordServiceFactory};
