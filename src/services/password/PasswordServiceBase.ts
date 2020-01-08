import { Password } from "../../entities/Password";
import { Volume } from "../../entities/Volume";
import { PasswordService } from "./PasswordService";

export default abstract class PasswordServiceBase implements PasswordService {
  abstract retrievePasswordCommand(volume: Volume): string;

  abstract saveNewPassword(password: Password): void;

  abstract searchForPassword(password: Password, volume: Volume): string | null;
}
