import { Volume } from "../../entities/Volume";
import { PasswordService } from "./PasswordService";
import { PasswordServiceOSX } from "./PasswordServiceOSX";
import { PasswordServiceLinux } from "./PasswordServiceLinux";

const os = require("os");

export class PasswordServiceFactory {
  public static create(volume: Volume): PasswordService {
    const managers = this.getManagers();
    if (!(os.platform() in managers)) {
      throw new Error(
        `The platform ${os.platform()} is not currently supported.`
      );
    }
    let manager = managers[os.platform()];
    return new manager(volume);
  }

  private static getManagers(): PasswordService {
    return {
      darwin: PasswordServiceOSX,
      linux: PasswordServiceLinux
    };
  }
}

// module.exports = PasswordServiceFactory;
