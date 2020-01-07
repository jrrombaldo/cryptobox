import EncryptionManagerBase from "./EncryptionServiceBase";
import { EncryptionService } from './EncryptionService'
import * as ShellHelper from "../../utils/ShellUtil";
import { log } from "../../utils/LogUtil";

// TODO: implement class correctly (currently it is a copy of EncryptionManagerOSX)
export class EncryptionManagerLinux extends EncryptionManagerBase implements EncryptionService  {

  getIsMountedCMD(destination: string): string {
    return `mount | grep -qs '${destination}'`
  }

  getMountCMD(source: string, destination: string, passwordManager: string): string {
    let impl = "encfs";
    return `${impl} ${source} ${destination} --standard --extpass='${passwordManager}' --require-macs -ohard_remove --idle=${this.idleTimeout}`;
  }

  getUmountCMD(destination: string): string {
    return `umount "${destination}"`
  }

}

module.exports = { EncryptionManagerLinux };
