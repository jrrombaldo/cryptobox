import { State } from "./State";
import { Volume } from "./Volume";
import { MountedState } from "./MountedState";

export class UnmountedState implements State {
  public next(volume: Volume): void {
    volume.state = new MountedState();
  }
}
