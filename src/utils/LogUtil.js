const log = require("electron-log");
// import { log } from "electron-log";

log.transports.file.level = true;
log.transports.console.format =
  "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}";

module.exports.log = log;
