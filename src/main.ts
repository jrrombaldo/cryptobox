import {app, BrowserWindow} from "electron";
import * as path from "path";

import {log} from "./utils/LogUtil";
import * as store from "./services/store/StoreManager"

log.debug(`config store ->${store}`)
log.debug(store)

require("update-electron-app")({
  repo: "bnh6/cryptobox",
  updateInterval: "1 hour",
  logger: log
});

let mainWindow: BrowserWindow;

const icoPath = "./static/resources/elec.icns";
const icoPathPNG = "./static/resources/cloud-enc.png";
const trayIcon = "../../static/resources/example.png";

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 360,
    fullscreenable: false,
    resizable: true,
    icon: path.join(__dirname, icoPath),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  mainWindow.setVisibleOnAllWorkspaces(true);
  mainWindow.loadFile(path.join(__dirname, "../static/ui/index.html"));

  const fs = require("fs");
  mainWindow.on("closed", function() {
    mainWindow = null;
  });

  mainWindow.on("unresponsive", function() {
    log.info("unresponsive, response to be implemented ...");
  });
}

app.on("ready", () => {
  //loadScripts();
  createWindow();
});

app.on("window-all-closed", function() {
  app.quit();
});

app.on("activate", function() {
  if (mainWindow === null) createWindow();
});

process.on("uncaughtException", function(error) {
  console.log("UNCATCH EXCEPTION FOUND ");
  console.log(error);
});

// no longer required, also the scripts no longers sits on a single folder.
// function loadScripts() {
//   const scripts = fs.readdirSync("./dist/client");
//   scripts.forEach(function(script: string) {
//     script.endsWith(".js") &&
//       import("./client/" + script) &&
//       log.debug(`imported: ${script} `);
//   });
// }
