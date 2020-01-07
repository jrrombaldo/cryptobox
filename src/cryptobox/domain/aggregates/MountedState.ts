import { State } from "./State";
import { Volume } from "./Volume";
import { UnmountedState } from "./UnmountedState";

export class MountedState implements State {
  public next(volume: Volume) {
    volume.state = new UnmountedState();
  }
}
