import { EncryptionService } from "../../domain/services/EncryptionService";
import { EncryptionServiceLinux } from "../services/Linux/EncryptionServiceLinux";
import { EncryptionServiceOSX } from "../services/OSX/EncryptionServiceOSX";
import * as os from "os";

export class EncryptionServiceFactory {
  public static create(): EncryptionService {
    const services = this.getServices();
    if (!(os.platform() in services)) {
      throw new Error(
        `The platform ${os.platform()} is not currently supported.`
      );
    }
    let service = services[os.platform()];
    return new service();
  }

  private static getServices(): any {
    return {
      darwin: EncryptionServiceOSX,
      linux: EncryptionServiceLinux
    };
  }
  }
}
