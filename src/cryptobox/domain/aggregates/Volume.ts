import { UnmountedState } from "./UnmountedState";
import { State } from "./State";

export class Volume {
  name: string;
  timeToUnmount: number;
  encryptedFolderPath: string;
  decryptedFolderPath: string;
  state: State;

  constructor() {
    this.state = new UnmountedState();
  }

  public nextState(): void {
    this.state.next(this);
  }
}
