const expect = require("chai").expect;
const shell = require("shelljs");
const EncryptionManagerFactory = require("../../scripts/EncryptionManagers/EncryptionManagerFactory");

function test_setup() {}

describe("scripts/EncryptionManagers/EncryptionManagerFactory(osname)", () => {
  describe("mount(source, destination, volumeName)", () => {
    it("Given source and destination folder should mount the volume from the correct source", () => {
      const os = require("os");
      const rootFolder = "~/cryptobox_temp_test";
      const sourceFolder = `${rootFolder}/encrypted`;
      const destinationFolder = `${rootFolder}/decrypted`;
      shell.mkdir(rootFolder);
      shell.mkdir(sourceFolder);
      shell.mkdir(destinationFolder);
      shell.exec(`echo '12345' >> ${rootFolder}/pass.txt`); //passwordManager para Linux
      if (os.platform() == 'darwin') {
        //adding password into MacOS keychain
        shell.exec(`security add-generic-password -a 'cryptobox:${sourceFolder}' -s 'cryptobox' -D 'application password' -j \"Adding password to execute unit test\" -w'12345' -U`); //passwordManager para Linux
      } else if (os.platform() == 'linux') {
        shell.exec(`echo '12345' >> ${rootFolder}/pass.txt`); //passwordManager para Linux
        //const passwordManager = `cat ${rootFolder}/pass.txt`;
      }
      const encryptionManager = EncryptionManagerFactory.create();
      encryptionManager.mount(sourceFolder, destinationFolder, "");
      shell.touch(`${destinationFolder}/test.txt`);
      const results = shell.exec(`mount | grep 'decrypted'`);
      shell.exec(`umount ${destinationFolder}`);
      shell.rm("-R", rootFolder);
      expect(results.code).to.eql(0);
    });
  });
});
