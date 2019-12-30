const EncryptionManagerOSX = require("./EncryptionManagerOSX");
const EncryptionManagerLinux = require("./EncryptionManagerLinux");
const os = require("os");

const EncryptionManagerFactory = {
  managers: {
    darwin: EncryptionManagerOSX,
    linux: EncryptionManagerLinux
  },
  create() {
    if (!(os.platform() in this.managers)) {
      throw new Error(
        `The platform ${os.platform()} is not currently supported.`
      );
    }
    let manager = this.managers[os.platform()];
    return new manager();
  }
};

module.exports = EncryptionManagerFactory;
