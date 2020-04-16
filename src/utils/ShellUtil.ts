import * as shell from "shelljs";
import { log } from "./LogUtil";
import * as constants from "./constants";

import * as path from "path";
import * as fs from "fs";
import * as os from "os";

// TODO: replace with https://www.npmjs.com/package/shelljs.exec
// INFO: https://github.com/shelljs/shelljs/wiki/Electron-compatibility
// shell.config.execPath = shell.which("node").stdout; // d
log.debug("shell.config.execPath", shell.config.execPath)
log.debug('shell.which("node")', shell.which("node"));
log.debug('shell.which("nodejs")', shell.which("nodejs"));


export function execute(
  cmd: any,
  silent: boolean = false,
  failOnNonZeroReturn: boolean = true,
  timeout: number = 5000
) {
  log.debug(`executing command ${cmd}`);

  var result = shell.exec(cmd, { silent: silent, timeout: timeout });
  log.info(
    `the [${cmd}] exit with code [${result.code}], stdout:[${result.stdout}] and stderr:[${result.stderr}]`
  );

  if (failOnNonZeroReturn && result && result.code && 0 != result.code) {
    throw new Error(`The command returned non-zero code [${result.code}]`);
  }

  return [result.code, result.stdout, result.stderr];
}

export function checkOSSupport() {
  const platform: string = os.platform();

  if (!Object.values(constants.SUPPORTED_PLATFORM).includes(platform)) {
    log.error(`unsuported platform [${platform}]`);
    return null;
  } else {
    log.info(`running on [${platform}]`);
    return platform;
  }
}

export function checkRequirements(): boolean {
  // cheking ENCFS
  const result = shell.which(constants.ENCFS)
  if (!result) {
    log.error("shelljs is not working :(")
    return false
  }
  if (result.code === 0) {
    log.info(`found encfs at ${result.stdout}`)
    return true
  }
  else {
    log.debug("encfs not found", result)
    return false;
    // throw new Error("EncFS not found, please install")
  }

}

export function checkDir(dir: string) {
  const fullpath = path.resolve(dir);
  log.debug(`absolute path: ${fullpath}`);

  if (!fs.existsSync(fullpath)) {
    log.debug(`directory [${fullpath}] does not exist, creating ...`);
    fs.mkdirSync(fullpath);
  }

  if (fs.statSync(fullpath).isDirectory()) {
    return fullpath;
  } else {
    log.error(`[${fullpath}] it is not a directory ...`);
    throw new Error(`[${fullpath}] is not a directory`);
  }
}

