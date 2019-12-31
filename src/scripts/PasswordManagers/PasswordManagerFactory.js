const PasswordManagerOSX = require("./PasswordManagerOSX");
const PasswordManagerLinux = require("./PasswordManagerLinux");
const os = require("os");

const PasswordManagerFactory = {
  managers: {
    darwin: PasswordManagerOSX,
    linux: PasswordManagerLinux
  },
  create(sourceFolder) {
    if (!(os.platform() in this.managers)) {
      throw new Error(
        `The platform ${os.platform()} is not currently supported.`
      );
    }
    let manager = this.managers[os.platform()];
    return new manager(sourceFolder);
  }
};

module.exports = PasswordManagerFactory;
