const EncryptionManagerOSX = require("./EncryptionManagerOSX");
const EncryptionManagerLinux = require("./EncryptionManagerLinux");

const EncryptionManagerFactory = {
  managers: {
    darwin: EncryptionManagerOSX,
    linux: EncryptionManagerLinux
  },
  create(currentOS) {
    let manager = this.managers[currentOS];
    return new manager();
  }
};

module.exports = EncryptionManagerFactory;
