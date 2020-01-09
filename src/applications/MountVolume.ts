import { EncryptionService } from "../services/encryption/EncryptionService";
import { PasswordService } from "../services/password/PasswordService";
import { Volume } from "../entities/Volume";
import { MountedState } from "../domain/aggregates/MountedState";

export class MountVolume {
  encryptionService: EncryptionService;
  passwordService: PasswordService;
  volume: Volume;
  response: string;

  constructor(
    volume: Volume,
    encryptionService: EncryptionService,
    passwordService: PasswordService
  ) {
    this.encryptionService = encryptionService;
    this.passwordService = passwordService;
    this.volume = volume;
  }

  public run(): void {
    try {
      this.checkVolumeState();
      this.mountVolume();
      this.response = `${this.volume.encryptedFolderPath} -> ${this.volume.decryptedFolderPath} mounted with success`;
    } catch (error) {
      this.response = error;
      throw new Error(error);
    }
  }

  private checkVolumeState(): void {
    if (this.volume.state instanceof MountedState) {
      throw new Error(
        `the volume ${this.volume.decryptedFolderPath} is already mounted.`
      );
    }
  }

  private mountVolume(): void {
    this.encryptionService.mount(this.volume, this.passwordService);
    const volumeIsMounted = this.encryptionService.volumeIsMounted(this.volume);
    if (volumeIsMounted === true) {
      this.volume.nextState();
    } else {
      const e = `error while trying to mount the volume ${this.volume.encryptedFolderPath}`;
      throw new Error(e);
    }
  }
}