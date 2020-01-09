import { EncryptionService } from "../services/encryption/EncryptionService";
import { Password } from "../entities/Password";
import { Volume } from "../entities/Volume";
import { VolumeState } from "../entities/VolumeState";

export class MountVolume {
  encryptionService: EncryptionService;
  password: Password;
  volume: Volume;
  response: string;

  constructor(
    volume: Volume,
    encryptionService: EncryptionService,
    password: Password
  ) {
    this.encryptionService = encryptionService;
    this.password = password;
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
    if (this.volume.state == VolumeState.Mounted) {
      throw new Error(
        `the volume ${this.volume.decryptedFolderPath} is already mounted.`
      );
    }
  }

  private mountVolume(): void {
    this.encryptionService.mount(this.volume, this.password);
    const volumeIsMounted = this.encryptionService.volumeIsMounted(this.volume);
    if (volumeIsMounted === true) {
      this.volume.state = VolumeState.Mounted;
    } else {
      const e = `error while trying to mount the volume ${this.volume.encryptedFolderPath}`;
      throw new Error(e);
    }
  }
}