const expect = require("chai").expect;
const shell = require("shelljs");
const EncryptionManagerLinux = require("../../scripts/EncryptionManagers/EncryptionManagerLinux");

function test_setup() {}

describe("scripts/EncryptionManagers/EncryptionManagerLinux", () => {
  describe("mount(source, destination, volumeName)", () => {
    it("Given source and destination folder should mount the volume from the correct source", () => {
      const rootFolder = "~/cryptobox_temp_test";
      const sourceFolder = `${rootFolder}/encrypted`;
      const destinationFolder = `${rootFolder}/decrypted`;
      shell.mkdir(rootFolder);
      shell.mkdir(sourceFolder);
      shell.mkdir(destinationFolder);
      shell.exec(`echo '12345' >> ${rootFolder}/pass.txt`);
      const encryptionManager = new EncryptionManagerLinux();
      // const passwordManager = `cat ${rootFolder}/pass.txt`;
      encryptionManager.mount(sourceFolder, destinationFolder, "");
      shell.touch(`${destinationFolder}/test.txt`);
      const results = shell.exec(`mount | grep 'decrypted'`);
      shell.exec(`umount ${destinationFolder}`);
      shell.rm("-R", rootFolder);
      expect(results.code).to.eql(0);
    });
  });
});
