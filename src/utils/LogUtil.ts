import log from "electron-log";

const isDev = process.argv0.includes("node_modules");

// log.transports.file.level = isDev ? false : true;

log.transports.console.format =
  "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}";

export default log;
