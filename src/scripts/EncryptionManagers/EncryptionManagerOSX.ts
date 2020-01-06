let format = require("string-format");
// import * as ShellHelper from "../ShellHelper";
// import { log } from "../LogHelper";
// import { PasswordManagerOSX } from "../PasswordManagers/PasswordManagerOSX";
import EncryptionManagerBase from "./EncryptionManagerBase";

export class EncryptionManagerOSX extends EncryptionManagerBase {
  getIsMountedCMD(destination:string):string{
    return `mount | grep -qs '${destination}'`
  }

  getUmountCMD(destination:string):string {
    return `umount "${destination}"`
  }

  getMountCMD(source:string, destination:string, passwordManager:string):string{
    let impl = "encfs";
    return  `${impl}  ${source} ${destination} --extpass='${passwordManager}'  --idle=${this.volumeName} --standard --require-macs -ovolname=${this.volumeName} -oallow_root -olocal -ohard_remove -oauto_xattr -onolocalcaches`;
  }
}

module.exports = { EncryptionManagerOSX };
