import EncryptionManagerBase from "./EncryptionManagerBase";
import * as ShellHelper from "../ShellHelper";
import { log } from "../LogHelper";

// TODO: implement class correctly (currently it is a copy of EncryptionManagerOSX)
export class EncryptionManagerLinux extends EncryptionManagerBase {
  MOUNT_CMD =
    "{encfs} {container} {mountPoint} --standard --extpass='{passwordManager}' --require-macs -ohard_remove --idle={idleMinutesToUnmount}";


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
