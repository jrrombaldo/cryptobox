import {Password} from '../../entities/Password'
import {Volume} from '../../entities/Volume'

export interface PasswordService {
    retrievePasswordCommand(volume: Volume): string;
    saveNewPassword(password: Password): string;
    searchForPassword(password: Password): string | null;
  }