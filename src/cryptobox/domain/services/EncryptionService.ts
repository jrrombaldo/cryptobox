import { Volume } from "../aggregates/Volume";
import { PasswordService } from "./PasswordService";

export interface EncryptionService {
  mount(volume: Volume, passwordService: PasswordService): void;
  unmount(volume: Volume): void;
  volumeIsMounted(volume: Volume): boolean;
}
