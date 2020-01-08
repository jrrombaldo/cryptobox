import { EncryptionService } from "./EncryptionService";
import { EncryptionServiceOSX } from "./EncryptionServiceOSX";
import { EncryptionServiceLinux } from "./EncryptionServiceLinux";
import * as os from "os";

export class EncryptionServiceFactory {
  public static create(): EncryptionService {
    const managers = this.getManagers();
    if (!(os.platform() in managers)) {
      throw new Error(
        `The platform ${os.platform()} is not currently supported.`
      );
    }
    let manager = managers[os.platform()];
    return new manager();
  }

  private static getManagers(): EncryptionService {
    return {
      darwin: EncryptionServiceOSX,
      linux: EncryptionServiceLinux
    };
  }
}

module.exports {EncryptionServiceFactory}
