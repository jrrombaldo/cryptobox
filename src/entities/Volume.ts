export class Volume {
    name: string;
    ttl: number;
    encryptedFolderPath: string;
    decryptedFolderPath: string;

    constructor(name: string, encryptedFolderPath: string, decryptedFolderPath: string, ttl: number) {
        this.name = name;
        this.encryptedFolderPath = encryptedFolderPath;
        this.decryptedFolderPath = decryptedFolderPath;
        this.ttl = ttl;
    }
}