const log = require('electron-log');

log.transports.file.level = false;
log.transports.console.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';

module.exports.log = log;