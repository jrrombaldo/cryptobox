let format = require("string-format");
import { EncryptionService } from './EncryptionService'
import EncryptionManagerBase from "./EncryptionServiceBase";

export class EncryptionManagerOSX extends EncryptionManagerBase implements EncryptionService {
  getIsMountedCMD(destination: string): string {
    return `mount | grep -qs '${destination}'`
  }

  getUmountCMD(destination: string): string {
    return `umount "${destination}"`
  }

  getMountCMD(source: string, destination: string, passwordManager: string): string {
    let impl = "encfs";
    return `${impl}  ${source} ${destination} --extpass='${passwordManager}'  --idle=${this.volumeName} --standard --require-macs -ovolname=${this.volumeName} -oallow_root -olocal -ohard_remove -oauto_xattr -onolocalcaches`;
  }
}

module.exports = { EncryptionManagerOSX };
