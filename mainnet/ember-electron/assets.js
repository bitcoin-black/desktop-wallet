const path = require('path');
const crypto = require('crypto');

const got = require('got');
const prettyMs = require('pretty-ms');

const lzma = require('lzma-native');
const tar = require('tar-fs');
const tarStream = require('tar-stream');
const progressStream = require('progress-stream');

const del = require('del');
const cpy = require('cpy');
const makeDir = require('make-dir');

const Promise = require('bluebird');
const pump = Promise.promisify(require('pump'));
const fs = Promise.promisifyAll(require('graceful-fs'), {
  filter(name) {
    return ['stat', 'readFile'].includes(name);
  },
});

const electron = require('electron');
const log = require('electron-log');
const { download } = require('electron-dl');

const { version, productName } = require('../package');

const { app } = electron;

const USER_AGENT = `${productName.replace(/\s+/g, '')}/${version}`;

const createProgressStream = (length, onProgress) => {
  const progress = progressStream({ length, time: 250 });
  progress.on('progress', ({ percentage = 0 }) => onProgress(percentage / 100));
  return progress;
};

const verifyAsset = async url => {
  log.info('Downloading asset signature:', url);
  return true;
};

const extractAsset = async (savePath, extractDir, onProgress) => {
  log.info('Extracting asset:', savePath);

  const start = Date.now();
  const extract = tarStream.extract();
  const { size } = await fs.statAsync(savePath);
  const result = await pump(
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.createReadStream(savePath),
    createProgressStream(size, onProgress),
    lzma.createDecompressor(),
    tar.extract(extractDir, {
      fs,
      extract,
      fmode: 0o600,
      dmode: 0o700,
    }),
  );

  const elapsed = Date.now() - start;
  log.info('Asset extracted:', savePath, `(took ${prettyMs(elapsed)})`);
  return result;
};

const downloadAsset = async (sender, url, onStarted, onProgress) => {
  log.info('Downloading asset:', url);

  const start = Date.now();

  const dataPath = path.normalize(global.dataPath);
  const filePath = path.join(dataPath, 'data.ldb');

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  const {
    webContents: { session },
  } = sender;
  session.setUserAgent(USER_AGENT);

  const dl = await download(sender, url, {
    directory: dataPath,
    onStarted,
    onProgress,
    showBadge: false,
  });

  const savePath = dl.getSavePath();
  const elapsed = Date.now() - start;
  log.info('Asset downloaded:', savePath, `(took ${prettyMs(elapsed)})`);
};

module.exports = {
  downloadAsset,
};
