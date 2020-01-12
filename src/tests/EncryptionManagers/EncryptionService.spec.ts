import { EncryptionServiceFactory } from "../../services/encryption/EncryptionServiceFactory";
import { PasswordService } from "../../services/password/PasswordService";
import { PasswordServiceFactory } from "../../services/password/PasswordServiceFactory";

import { Volume } from "../../entities/Volume";
import { Password } from "../../entities/Password";
import * as constants from "../../utils/constants";

const expect = require("chai").expect;
const shell = require("shelljs");

import * as os from "os";
// const rootFolder = "~/cryptobox";
const rootFolder = "/tmp/cryptobox";
const sourceFolder = `${rootFolder}/encrypted`;
const destinationFolder = `${rootFolder}/decrypted`;
const passwordValue = "MyPassword@2020";
const volumeName = "Testing";

const volume: Volume = new Volume(
  volumeName,
  sourceFolder,
  destinationFolder,
  0
);
const password: Password = new Password(passwordValue);

const validateShellExecution = (result: any) => {
  if (result.code != 0) {
    console.log(
      `function failed, result=[${result.code}], stdout=[${result.stdout}] stderr[${result.stderr}]`
    );
    throw new Error(`function returned ${result.code}`);
  }
};

describe("scripts/EncryptionService/EncryptionServiceFactory(osname)", () => {
  describe("mount(source, destination, volumeName)", () => {
    before(() => {
      validateShellExecution(shell.mkdir(rootFolder));
      validateShellExecution(shell.mkdir(volume.encryptedFolderPath));
      validateShellExecution(shell.mkdir(volume.decryptedFolderPath));
    });

    it("create password", () => {
      let passwordService: PasswordService = PasswordServiceFactory.create();
      passwordService.saveNewPassword(password, volume);
    });

    it("retrieve password", () => {
      let returnedPassword: string;
      let passwordService: PasswordService = PasswordServiceFactory.create();
      returnedPassword = passwordService.searchForPassword(password, volume);
      
      expect(returnedPassword).to.eql(passwordValue+"\n");
    });

    it("mount volume", () => {
      let encryptionService = EncryptionServiceFactory.create();
      encryptionService.mount(volume, password);
    });

    it("is volume mounted", () => {
      let encryptionService = EncryptionServiceFactory.create();
      let isMounted = encryptionService.isMounted(volume);
      expect(isMounted).to.eql(true);
    });

    //  even if is not mounted, is possible to create a file, so irrelevant test
    // it("creating file on the mounted volume", () => {
    //   validateShellExecution(
    //     shell.touch(`${volume.decryptedFolderPath}/test.txt`)
    //   );
    // });

    it("umount volume", () => {
      let encryptionService = EncryptionServiceFactory.create();
      encryptionService.unmount(volume);
    });

    it("should not be mounted", () => {
      let encryptionService = EncryptionServiceFactory.create();
      let isMounted = encryptionService.isMounted(volume);
      expect(isMounted).to.eql(false);
    });

    it("delete password", () => {
      if (os.platform() == "darwin") {
        let passwordService: PasswordService = PasswordServiceFactory.create();
        passwordService.deletePassword(volume);
      }
    });

    after(() => {
      validateShellExecution(shell.rm("-R", rootFolder));
    });

    // it("Given source and destination folder should mount the volume from the correct source", () => {
    //   shell.mkdir(rootFolder);
    //   shell.mkdir(sourceFolder);
    //   shell.mkdir(destinationFolder);
    //   shell.exec(`echo '12345' >> ${rootFolder}/pass.txt`); //passwordManager para Linux
    //   if (os.platform() == "darwin") {
    //     //adding password into MacOS keychain
    //     console.log("creating keychain entries");
    //     console.log(
    //       shell.exec(
    //         `security add-generic-password -s 'cryptobox://${sourceFolder}' -a '${constants.OSX_KEYCHAIN_ACCOUNT}' -D 'application password' -j \"Adding password to execute unit test\" -w'12345' -U`
    //       )
    //     );

    //     // checking password
    //     console.log("reading keychain entry");
    //     console.log(
    //       shell.exec(
    //         `security find-generic-password  -a "${constants.OSX_KEYCHAIN_ACCOUNT}" -s 'cryptobox://${sourceFolder}' -w `
    //       )
    //     );

    //     console.log("\n\nTESTTING MANUALLYNN");
    //     console.log(
    //       shell.exec(
    //         `ls -larth /tmp/cryptobox/; echo -e "\n\n\n"; encfs /tmp/cryptobox/encrypted /tmp/cryptobox/decrypted --standard --extpass='cat /tmp/cryptobox/pass.txt' --require-macs -ohard_remove; echo -e "\n\n\n"; mount; echo -e "\n\n\n"; umount /tmp/cryptobox/decrypted; sleep 2`
    //       )
    //     );
    //     console.log("\nFINISHED MANUAL TESTNN");

    //     //passwordManager para Linux
    //   } else if (os.platform() == "linux") {
    //     shell.exec(`echo '12345' >> ${rootFolder}/pass.txt`); //passwordManager para Linux
    //     //const passwordManager = `cat ${rootFolder}/pass.txt`;
    //   }
    //   const encryptionManager = EncryptionServiceFactory.create();
    //   //TODO: instantiate correctly Volume and Password to make test works
    //   encryptionManager.mount(
    //     new Volume("testing", sourceFolder, destinationFolder, 0),
    //     new Password(passwordValue)
    //   );
    //   shell.touch(`${destinationFolder}/test.txt`);
    //   const results = shell.exec(`mount | grep 'decrypted'`);
    //   shell.exec(`umount ${destinationFolder}`);
    //   shell.rm("-R", rootFolder);
    //   if (os.platform() == "darwin") {
    //     console.log("deleting keychain entry");
    //     console.log(
    //       shell.exec(
    //         `security delete-generic-password -a "${constants.OSX_KEYCHAIN_ACCOUNT}" -s 'cryptobox://${sourceFolder}'`
    //       )
    //     );
    //   }
    //   expect(results.code).to.eql(0);
    // }).timeout(25000);
  });
});
