import { EncryptionService } from "./EncryptionService";
import { EncryptionServiceOSX } from "./EncryptionServiceOSX";
import { EncryptionServiceLinux } from "./EncryptionServiceLinux";
import * as os from "os";

export class EncryptionServiceFactory {
  public static create(): EncryptionService {
    const managers: {[platform: string] : EncryptionService} = this.getManagers();
    if (!(os.platform() in managers)) {
      throw new Error(
        `The platform ${os.platform()} is not currently supported.`
      );
    }
    let manager = managers[os.platform()];
    return manager;
  }

  private static getManagers(): {[platform: string] : EncryptionService}  {
    return {
      'darwin': new EncryptionServiceOSX,
      'linux':  new EncryptionServiceLinux
    }
  }
}

module.exports = {EncryptionServiceFactory};
