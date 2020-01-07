import { Volume } from "./Volume";

export interface State {
  next(volume: Volume): void;
}
