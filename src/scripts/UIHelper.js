const { dialog } = require('electron')


// ======  reading directories with native dialog, to avoid security issues with browsers
function getDirectoryNatively() {
    var directory = dialog.showOpenDialogSync({ properties: ['openDirectory'] })
    log.info(`getDirectoryNatively result: [${directory}]`)
    return directory
}



module.exports = {getDirectoryNatively}