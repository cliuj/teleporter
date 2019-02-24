'use strict';

const fs = require('fs');

const isValidDirPath = (path) => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, data) => {
      if (err) {
        return reject("Path does not exist");
      }
      return resolve(data.isDirectory());
    });
  });
}

module.exports = { isValidDirPath };
