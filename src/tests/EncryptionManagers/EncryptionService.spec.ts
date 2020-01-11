import { EncryptionServiceFactory } from "../../services/encryption/EncryptionServiceFactory";
import { Volume } from "../../entities/Volume";
import { Password } from "../../entities/Password";
import * as constants from "../../utils/constants";

const expect = require("chai").expect;
const shell = require("shelljs");

function test_setup() {}

describe("scripts/EncryptionService/EncryptionServiceFactory(osname)", () => {
  describe("mount(source, destination, volumeName)", () => {
    it("Given source and destination folder should mount the volume from the correct source", () => {
      const os = require("os");
      // const rootFolder = "~/cryptobox";
      const rootFolder = "/tmp/";
      const sourceFolder = `${rootFolder}/encrypted`;
      const destinationFolder = `${rootFolder}/decrypted`;
      shell.mkdir(rootFolder);
      shell.mkdir(sourceFolder);
      shell.mkdir(destinationFolder);
      shell.exec(`echo '12345' >> ${rootFolder}/pass.txt`); //passwordManager para Linux
      if (os.platform() == "darwin") {
        //adding password into MacOS keychain
        console.log("creating keychain entries");
        console.log(
          shell.exec(
            `security add-generic-password -s 'cryptobox://${sourceFolder}' -a '${constants.OSX_KEYCHAIN_ACCOUNT}' -D 'application password' -j \"Adding password to execute unit test\" -w'12345' -U`
          )
        );

        // checking password
        console.log("reading keychain entry");
        console.log(
          shell.exec(
            `security find-generic-password  -a "${constants.OSX_KEYCHAIN_ACCOUNT}" -s 'cryptobox://${sourceFolder}' -w `
          )
        ); //passwordManager para Linux

        //passwordManager para Linux
      } else if (os.platform() == "linux") {
        shell.exec(`echo '12345' >> ${rootFolder}/pass.txt`); //passwordManager para Linux
        //const passwordManager = `cat ${rootFolder}/pass.txt`;
      }
      const encryptionManager = EncryptionServiceFactory.create();
      //TODO: instantiate correctly Volume and Password to make test works
      encryptionManager.mount(
        new Volume("testing", sourceFolder, destinationFolder, 0),
        new Password()
      );
      shell.touch(`${destinationFolder}/test.txt`);
      const results = shell.exec(`mount | grep 'decrypted'`);
      shell.exec(`umount ${destinationFolder}`);
      shell.rm("-R", rootFolder);
      expect(results.code).to.eql(0);
    });
  });
});
