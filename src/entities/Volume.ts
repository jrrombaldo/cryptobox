import { VolumeState } from "./VolumeState";

export class Volume {
    name: string;
    ttl: number;
    encryptedFolderPath: string;
    decryptedFolderPath: string;
    state: VolumeState;
}