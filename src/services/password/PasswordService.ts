import { Password } from "../../entities/Password";
import { Volume } from "../../entities/Volume";

export interface PasswordService {
  retrievePasswordCommand(volume: Volume): string;
  saveNewPassword(password: Password, volume: Volume): void;
  searchForPassword(password: Password, volume: Volume): string | null;
}
