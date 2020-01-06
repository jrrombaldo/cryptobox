import { EncryptionManagerOSX } from "./EncryptionManagerOSX";
import { EncryptionManagerLinux } from "./EncryptionManagerLinux";
import * as os from "os";

export class EncryptionManagerFactory {
  public static create() {
    const managers = this.getManagers();
    if (!(os.platform() in managers)) {
      throw new Error(
        `The platform ${os.platform()} is not currently supported.`
      );
    }
    let manager = managers[os.platform()];
    return new manager();
  }

  private static getManagers(): any {
    return {
      darwin: EncryptionManagerOSX,
      linux: EncryptionManagerLinux
    };
  }
}
