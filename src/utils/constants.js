module.exports = Object.freeze({
    ENCFS: 'encfs',

    OSX_KEYCHAIN_ACCOUNT: "CryptoBox",

    CONFIG_FILE:"settings",
    CONFIG_DIR:".cryptobox",
    CONFIG_ENCKEY:"4Z94d2tErFhU28tL", //TODO - should go to the KeyChain


    IPC_GET_DIRECTORY: "zNhyGnWiqabsyPuOKOCc",
    IPC_ACCT_EXISTS: "fSEvzUveABIZCypkXPGE",
    IPC_IS_MOUNTED: "qdNhgTGYmniSwJKTijFx",
    IPC_MOUNT_UNMOUNT: "agjHVeGQNYADkZSXFtDf",


    SUPPORTED_PLATFORM: Object.freeze({
        darwin: "darwin",
        freebsgd: "freebsd",
        linux: "linux"
    }),

});