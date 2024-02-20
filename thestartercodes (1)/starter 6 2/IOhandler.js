/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const { pipeline } = require("stream");

// const unzipper = require("unzipper"),
//   fs = require("fs"),
//   PNG = require("pngjs").PNG,
//   path = require("path");

const yauzl = require('yauzl-promise'),
  fs = require('fs'),
  path = require('path'),
  PNG = require('pngjs').PNG;


/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = async (pathIn, pathOut) => {
  const zip = await yauzl.open(pathIn)
try {
  for await (const entry of zip) {
    if (entry.filename.endsWith('/')) {
      await fs.promises.mkdir(path.join(pathOut, entry.filename), { recursive: true });
    } else {
      const readStream = await entry.openReadStream();
      const writeStream = fs.createWriteStream(
        path.join(pathOut, entry.filename)
      );
      await new Promise((resolve, reject) => {
        pipeline(readStream, writeStream, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }
  }
} finally {
  await zip.close();
}
};
// use promise to handle async operation

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      }
      const pngFiles = files.filter((file) => {
        return path.extname(file) === ".png";
      });
      resolve(pngFiles);
      console.log(pngFiles);
    });
  });
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const inverted = (pathIn, pathOut) => {
  fs.createReadStream(pathIn)
  .pipe(
    new PNG({
      filterType: 4,
    })
  )
  .on("parsed", function () {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var idx = (this.width * y + x) << 2;

        // invert color
        this.data[idx] = 255 - this.data[idx];
        this.data[idx + 1] = 255 - this.data[idx + 1];
        this.data[idx + 2] = 255 - this.data[idx + 2];

        // and reduce opacity
        this.data[idx + 3] = this.data[idx + 3] >> 1;
      }
    }

    this.pack().pipe(fs.createWriteStream(pathOut));
  });
};

const grayscaled = (pathIn, pathOut) => {
  fs.createReadStream(pathIn)
  .pipe(
    new PNG({
      filterType: 4,
    })
  )
  .on("parsed", function () {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var idx = (this.width * y + x) << 2;
        const gray = Math.round((this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3);

        // grayed
        this.data[idx] = gray;
        this.data[idx + 1] = gray;
        this.data[idx + 2] = gray;
      }
    }

    this.pack().pipe(fs.createWriteStream(pathOut));
  });
};


module.exports = {
  unzip,
  readDir,
  inverted,
  grayscaled,
};
