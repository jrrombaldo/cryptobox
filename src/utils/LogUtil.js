const log = require("electron-log");
// import { log } from "electron-log";

const isDev = process.argv0.includes("node_modules");
log.transports.file.level = !isDev;

log.transports.console.format =
  "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}";

module.exports.log = log;
