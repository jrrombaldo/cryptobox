abstract class EncryptionManagerBase {
    volumeName: string = "cryptobox";

    setVolumeNme(source: string): void {
        // this.volumeName = path.basename(source).concat(constants.VOLUME_NAME_SUFIX);
        this.volumeName = "cryptobox";
    }

    abstract mount(string: string, destination: string): void;

    abstract unmount(destination: string): void;

    abstract isMounted(destination: string): boolean;
}

module.exports = {EncryptionManagerBase};
