import { Volume } from "../aggregates/Volume";

export interface PasswordService {
  retrievePasswordCommand(volume: Volume): string;
  saveNewPassword(volume: Volume): string;
  searchForPassword(volume: Volume): string | null;
}
