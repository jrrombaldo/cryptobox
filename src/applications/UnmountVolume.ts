import { EncryptionService } from "../services/encryption/EncryptionService";
import { Volume } from "../entities/Volume";

export class UnmountVolume {
  encryptionService: EncryptionService;
  volume: Volume;
  response: string;

  constructor(volume: Volume, encryptionService: EncryptionService) {
    this.encryptionService = encryptionService;
    this.volume = volume;
    this.response = "";
  }

  public run(): void {
    try {
      this.unmountVolume();
      this.response = `${this.volume.decryptedFolderPath} unmounted with success`;
    } catch (error) {
      this.response = error;
      throw new Error(error);
    }
  }

  private unmountVolume(): void {
    this.encryptionService.unmount(this.volume);
    const volumeIsMounted = this.encryptionService.isMounted(this.volume);
    if (volumeIsMounted === true) {
      const e = `error while trying to unmount the volume ${this.volume.decryptedFolderPath}`;
      throw new Error(e);
    }
  }
}