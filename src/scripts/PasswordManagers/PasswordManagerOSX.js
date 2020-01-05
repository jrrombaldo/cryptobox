const format = require("string-format");

const OSX_KEYCHAIN_ACCOUNT = "cryptobox";
const OSX_KEYCHAIN_SEARCH_CMD =
  'security find-generic-password  -a "{account}" -s "{service}" -w ';
const OSX_KEYCHAIN_SAVE_CMD =
  "security add-generic-password -a '{account}' -s '{service}' -D 'application password' -j \"{comment}\" -w'{password}' -U";
const OSX_KEYCHAIN_DESC = "Created by cloud-enc @ $( date +'%Y.%m.%d-%H:%M')";

class PasswordManagerOSX {
  constructor(sourceFolder) {
    this.entryName = this.getAccountName(sourceFolder);
    log.debug(`Instance of OSX password manager for ${this.entryName}`);
  }

  getAccountName(sourceFolder) {
    return `${OSX_KEYCHAIN_ACCOUNT}:${sourceFolder}`;
  }

  getPasswordApp() {
    var command = format(OSX_KEYCHAIN_SEARCH_CMD, {
      account: this.entryName,
      service: OSX_KEYCHAIN_ACCOUNT
    });
    return command;
  }

  searchForPassword() {
    log.info(`searching password for ${this.entryName}`);

    var command = this.getPasswordApp();

    var [result, stdout, stderr] = ShellHelper.execute(command, true);

    if (result === 0) return stdout;
    if (result === 44)
      // not found
      return null;
    if (result === 0) {
      log.error(`unknonw error when searching password`);
      return null;
      // throw new Error(stderr)
    }
  }

  savePassword() {
    log.info(`saving password for ${this.entryName}`);

    var command = (format(OSX_KEYCHAIN_SAVE_CMD, {
      account: getAccountName(source),
      service: OSX_KEYCHAIN_ACCOUNT,
      password: password,
      comment: OSX_KEYCHAIN_DESC
    })[(status, result)] = ShellHelper.execute(command));
  }
}

module.exports = PasswordManagerOSX;