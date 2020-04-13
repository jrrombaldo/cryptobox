import { Password } from "../entities/Password";
import { Volume } from "../entities/Volume";
import { PasswordService } from "../services/password/PasswordService";
import { PasswordServiceFactory } from "../services/password/PasswordServiceFactory";
var log = require("../utils/LogUtil").log;



export class PasswordApplication {
    passwordService: PasswordService
    constructor() {
        this.passwordService = PasswordServiceFactory.create();
    }

    checkSource(sourceVol: Volume) {
        let password = this.passwordService.searchForPassword(sourceVol)

        if (password) {
            log.info(` password found ${password.passwordValue}`)
        }
        else {
            log.info("password not found, prompting one")
            //TODO must be promted by the user
            let passwordToSave = new Password("test123");
            this.passwordService.saveNewPassword(passwordToSave, sourceVol)
        }
    }

    findPassword(volume: Volume): Password {
        return this.passwordService.searchForPassword(volume)
    }

}




