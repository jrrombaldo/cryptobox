import { log } from "../../utils/LogUtil";
import * as path from "path";
import * as os from "os";

const constants = require("../../utils/constants");

const Store = require("electron-store");

log.info("initialising config store ...");
const store = new Store({
  cwd: path.join(os.homedir(), constants.CONFIG_DIR),
  name: constants.CONFIG_FILE,
  fileExtension: "json",
  encryptionKey: constants.CONFIG_ENCKEY,
  clearInvalidConfig: false,
});

const runDate = new Date().toLocaleString();
log.info(`last run -> ${store.get("last-run")}`);
let o = store.set("last-run", runDate);
log.info(o);

module.exports.config = store;
