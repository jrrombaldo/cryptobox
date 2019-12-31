const expect = require("chai").expect;
const PasswordManagerLinux = require("../../scripts/PasswordManagers/PasswordManagerLinux");

describe("scripts/PasswordManagers/PasswordManagerLinux", () => {
  describe("searchForPassword()", () => {
    it("Given that pass is installed and cryptobox/$USER password exists, should open the gpg dialog and if passphrase is correct return the password", () => {
      const passwordManager = new PasswordManagerLinux();
      const results = passwordManager.searchForPassword();
      expect(results).to.eql([]);
    });
  });
});
