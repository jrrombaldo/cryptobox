// import * as shell from "shelljs";
import { log } from "./LogUtil";
import * as constants from "./constants";

// import * as path from "path";
// import * as fs from "fs";
import * as os from "os";

// TODO: replace with https://www.npmjs.com/package/shelljs.exec
// INFO: https://github.com/shelljs/shelljs/wiki/Electron-compatibility
// shell.config.execPath = shell.which("node").stdout; // d
// log.debug("shell.config.execPath", shell.config.execPath)
// log.debug('shell.which("node")', shell.which("node"));
// log.debug('shell.which("nodejs")', shell.which("nodejs"));



// import { execSync } from 'child_process';  // since node 4
import { spawnSync } from 'child_process'; // since node 12



// https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options
export function execute(
  command: string,
  args: string[] = [],
  failOnNonZeroReturn: boolean = true,
  timeout: number = 5000): [number, string, string] {

  log.debug(`executing command [${command}] [${args}]`);

  const result = spawnSync(command, args, {
    timeout,
    shell: true,
    windowsHide: true
  });

  if (result && result.error) {
    log.error(`command [${command}] failed with error = [${result.error}] ...`)
    log.error(result)
    throw result.error
  }

  if (failOnNonZeroReturn && result && result.status && 0 !== result.status) {
    throw new Error(`The command returned non-zero code [${result.status}]`);
  }

  log.debug(`command [${command}] returned status [${result.status}]`);

  return [
    result.status,
    result.stdout.toString(),
    result.stderr.toString()];
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
  // const result = shell.which(constants.ENCFS)
  // if (!result) {
  //   log.error("shelljs is not working :(")
  //   return false
  // }
  // if (result.code === 0) {
  //   log.info(`found encfs at ${result.stdout}`)
  //   return true
  // }
  // else {
  //   log.debug("encfs not found", result)
  //   return false;
  //   // throw new Error("EncFS not found, please install")
  // }

  return true

}

// export function checkDir(dir: string) {
//   const fullpath = path.resolve(dir);
//   log.debug(`absolute path: ${fullpath}`);

//   if (!fs.existsSync(fullpath)) {
//     log.debug(`directory [${fullpath}] does not exist, creating ...`);
//     fs.mkdirSync(fullpath);
//   }

//   if (fs.statSync(fullpath).isDirectory()) {
//     return fullpath;
//   } else {
//     log.error(`[${fullpath}] it is not a directory ...`);
//     throw new Error(`[${fullpath}] is not a directory`);
//   }
// }

