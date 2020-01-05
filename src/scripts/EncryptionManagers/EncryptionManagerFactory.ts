// let EncryptionManagerOSX = require('./EncryptionManagerOSX.ts');
// let EncryptionManagerLinux = require('./EncryptionManagerLinux.ts');
import{ EncryptionManagerOSX} from './EncryptionManagerOSX';
import{EncryptionManagerLinux} from './EncryptionManagerLinux';

const os = require("os");
export const EncryptionManagerFactory = {
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

// module.exports = EncryptionManagerFactory;
