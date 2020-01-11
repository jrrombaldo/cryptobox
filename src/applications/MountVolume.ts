import {EncryptionService} from "../services/encryption/EncryptionService";
import {Password} from "../entities/Password";
import {Volume} from "../entities/Volume";

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
      this.mountVolume();
      this.response = `${this.volume.encryptedFolderPath} -> ${this.volume.decryptedFolderPath} mounted with success`;
    } catch (error) {
      this.response = error;
      throw new Error(error);
    }
  }

  private mountVolume(): void {
    this.encryptionService.mount(this.volume, this.password);
    const volumeIsMounted = this.encryptionService.isMounted(this.volume);
    if (volumeIsMounted === false) {
      const e = `error while trying to mount the volume ${this.volume.encryptedFolderPath}`;
      throw new Error(e);
    }
  }
}