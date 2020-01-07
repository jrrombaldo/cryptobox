const expect = require("chai").expect;
const PasswordManagerLinux = require("../../services/password/PasswordManagerLinux");

describe.skip("scripts/PasswordManagers/PasswordManagerLinux", () => {
  describe("searchForPassword()", () => {
    it("Given that pass is installed and cryptobox folder exists inside pass folder, should open the gpg dialog and if passphrase is correct return the password", () => {
      const sourceFolder = "/home/rafael/pasta-secreta";
      const passwordManager = new PasswordManagerLinux(sourceFolder);
      const results = passwordManager.searchForPassword();
      expect(results).to.eql([]);
    });
  });
});
