const log = require('electron-log');
// disable logging on file
log.transports.file.level = false;
log.transports.console.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';


//  making log variable global
// global.log = log
// export default log
module.exports.log = log