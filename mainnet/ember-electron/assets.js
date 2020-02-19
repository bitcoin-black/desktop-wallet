const path = require('path')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('graceful-fs'), {
  filter (name) {
    return ['stat', 'readFile'].includes(name)
  },
})

const log = require('electron-log')
const { download } = require('electron-dl')

const { version, productName } = require('../package')

const USER_AGENT = `${productName.replace(/\s+/g, '')}/${version}`

const downloadAsset = async (sender, url, onStarted, onProgress) => {
  url = 'http://165.22.253.160/livedb/data.tar.gz'
  log.info('Downloading asset:', url)

  const tar = require('tar')
  const dataPath = path.normalize(global.dataPath)
  const filePath = path.join(dataPath, 'data.ldb')
  const compressedFilePath = path.join(dataPath, 'data.tar.gz')

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }

  const {
    webContents: { session },
  } = sender
  session.setUserAgent(USER_AGENT)

  // Download data
  await download(sender, url, {
    directory: dataPath,
    onStarted,
    onProgress,
    showBadge: false,
  })

  // Extract data
  await tar.x( 
    {
      cwd: dataPath,
      file: compressedFilePath,
      unlink: true
    }
  )

  log.info('Asset downloaded successfully!')
}

module.exports = {
  downloadAsset,
}
