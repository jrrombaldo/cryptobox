import { EncryptionService } from "../domain/services/EncryptionService";
import { Volume } from "../domain/aggregates/Volume";
import { UnmountedState } from "../domain/aggregates/UnmountedState";

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
      this.checkVolumeState();
      this.unmountVolume();
      this.response = `${this.volume.decryptedFolderPath} unmounted with success`;
    } catch (error) {
      this.response = error;
      throw new Error(error);
    }
  }

  private checkVolumeState(): void {
    if (this.volume.state instanceof UnmountedState) {
      throw new Error(
        `the volume ${this.volume.encryptedFolderPath} is not mounted.`
      );
    }
  }

  private unmountVolume(): void {
    this.encryptionService.unmount(this.volume);
    const volumeIsMounted = this.encryptionService.volumeIsMounted(this.volume);
    if (volumeIsMounted === false) {
      this.volume.nextState();
    } else {
      const e = `error while trying to unmount the volume ${this.volume.decryptedFolderPath}`;
      throw new Error(e);
    }
  }
}