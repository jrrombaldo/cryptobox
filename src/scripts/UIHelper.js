const { dialog } = require('electron')


// ======  reading directories with native dialog, to avoid security issues with browsers
function getDirectoryNatively() {
    var directory = dialog.showOpenDialogSync({ properties: ['openDirectory'] })
    log.info(`getDirectoryNatively result: [${directory}]`)
    return directory
}

function confirmPasswordUse(){
    const options = {
        type: 'info',
        title: 'password confirmation',
        message: 'There is a pasword recorded on keychain for this folder, would you like reuse or replace? note that the previous password will be lost',
        buttons: ['Reuse existing password', 'Replace with a new password']
    };
    dialog.showMessageBox(options, (index) => {
        if (index === 0)
            return true
        if (index === 1)
            return false

    })
}



module.exports = {getDirectoryNatively, confirmPasswordUse}