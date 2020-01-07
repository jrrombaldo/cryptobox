import {Password} from '../../entities/Password'
import {Volume} from '../../entities/Volume'
import {PasswordService} from '../password/PasswordService'

export interface EncryptionService {
  mount(volume: Volume, passwordService: PasswordService): void;
  unmount(volume: Volume): void;
  volumeIsMounted(volume: Volume): boolean;
}