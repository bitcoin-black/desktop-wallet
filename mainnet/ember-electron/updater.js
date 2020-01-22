const log = require('electron-log')
const request = require('request')
const path = require('path')
const { download } = require('electron-dl')
const fs = require('fs')
const { version, productName } = require('../package')
const { BrowserWindow } = require('electron')
const dataPath = path.normalize(global.dataPath)

exports.CheckApplicationUpdate = async () => {
    let updateURL = `http://157.245.81.151/updater/mainnet/${process.platform}/`
    let cloudDetails = await getCloudVersion(updateURL)
    let downloadUpdate = await isUpdateAvailable(version, cloudDetails.version)
    if (downloadUpdate) {
        let downloadFileURL = updateURL + cloudDetails.fileName
        let filePath = await downloadFile(cloudDetails.fileName, downloadFileURL)
        if (fs.existsSync(filePath)) {
            showUpdateNotification(cloudDetails.version, filePath)
        }
    }
}

async function downloadFile (fileName, fileURL) {
    log.info('Checking downloaded update')

    const filePath = path.join(dataPath, fileName)
    const updatesuccess = path.join(dataPath, 'updatesuccess')

    if (fs.existsSync(filePath) && fs.existsSync(updatesuccess)) {
        // Show notification to update
        return filePath
    }

    if (fs.existsSync(filePath) && !fs.existsSync(updatesuccess)) {
        try {
            fs.unlinkSync(filePath)
        } catch (e) {

        }
    }

    const win = BrowserWindow.getFocusedWindow();

    // const progress = (p) => { console.log(p) }

    try {
        fs.unlinkSync(updatesuccess)
    } catch (e) {

    }

    log.info('Downloading update:', fileURL)
    await download(win, fileURL, {
        directory: dataPath,
        // onProgress: progress
    })

    fs.writeFileSync(updatesuccess, '')
    log.info('Update downloaded successfully!')
    return filePath
}

function getCloudVersion (updateURL) {
    return new Promise((resolve, reject) => {
        request.get({
            url: `${updateURL}update.json`
        }, (error, response) => {
            if (error || response.statusCode !== 200) {
                log.error(error)
                return reject(error)
            }

            try {
                let cloudDetails = JSON.parse(response.body)
                return resolve(cloudDetails)
            } catch (error) {
                log.error(error)
                return reject(error)
            }

        })
    })
}
/** Version check */
function isUpdateAvailable (currentVersion, cloudVersion) {
    return new Promise((resolve) => {
        try {

            let splitCV = currentVersion.split('.'),
                splitMV = cloudVersion.split('.')

            let cuMajor = parseInt(splitCV[0]),
                cuMinor = parseInt(splitCV[1]),
                cuHotFix = parseInt(splitCV[2]),
                mvMajor = parseInt(splitMV[0]),
                mvMinor = parseInt(splitMV[1]),
                mvHotfix = parseInt(splitMV[2])

            if (cuMajor < mvMajor || (cuMajor == mvMajor && cuMinor < mvMinor) || (cuMajor == mvMajor && cuMinor == mvMinor && cuHotFix < mvHotfix)) {
                return resolve(true)
            }

            return resolve(false)

        } catch (err) {
            log.error('isUpdateAvailable Error: ' + err)
            return resolve(false)
        }
    })
}

function showUpdateNotification (version, filePath) {
    require('electron').dialog.showMessageBox(new BrowserWindow({
        alwaysOnTop: true,
        show: false,
        parent: BrowserWindow.getFocusedWindow()
    }), {
        type: 'info',
        buttons: ['Yes, Install Now', 'Remind Me Later'],
        message: 'New Update Available. Version: ' + version,
        detail: `New application version ${version} is available. Do you want to install it?`
    }, (response) => {
        if (response == '0') {
            fs.unlinkSync(path.join(dataPath, 'updatesuccess'))
            require('child_process').exec(`"${filePath}"`, (e) => {
                if (e) {
                    log.error(e)
                }
            })
            setTimeout(() => {
                require('electron').app.exit()
            }, 4000)
        }
    })
}