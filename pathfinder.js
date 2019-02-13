#!/usr/bin/env node
'use strict';

const fs = require('fs');
const db = require('./db');
const args = process.argv.slice(2);

function errorMsg(error) {
  console.log("Error:", error);
}

async function addDBLocation(key, value) {

  let path = value;
  const validDirPromise = new Promise((resolve) => {
    if (path === '..') {
      return errorMsg(".. not allowed");
    }

    if (value === '.') {
      path = process.cwd();
    } else if (!value.includes("~/")) {
      path = [process.cwd(), '/', value].join("");
    }
    resolve(path);
  });

  validDirPromise.then((valid) => {
    fs.access(value, function(err) {
      if(err && err.code === 'ENOENT') {
        return errorMsg("Invalid Directory");
      }
    })
    
    db.get(key, function(err) {
      if (err) {
        if (err.notFound) {
          return db.put(key, path);
        }
      }
    })
    return db.put(key, path);
  });
}

async function deleteDBLocation(key) {
  try {
    await db.del(key);
  } catch (err) {
    return console.log(err);
  }
  return;
}

async function getLocation(key) {
  try {
    const path = await db.get(key);
  } catch (err) {
    return errorMsg("Key not found");
  }
  return console.log(await db.get(key));
}

async function listDBContents() {
  console.log("Locations stored in DB:");
  console.log("-----------------------");
  await db.createReadStream()
    .on('data', function(data) {
      console.log(data.key, '==>', data.value)
    })
    .on('error', function(err) {
      return errorMsg("Failed to list the contents of DB");
    })
  return;
}


function processArgs() {
  switch(args[0]) {
    case '-a': case '--add':
      if (!args[2]) {
        return errorMsg("Missing target directory");
      }
      return addDBLocation(args[1], args[2]);

    case '-d': case '--delete':
      if(!args[1]) {
        return errorMsg("No args passed");
      }
      return deleteDBLocation(args[1]);

    case '-l': case '--list':
      return listDBContents();

    case '-h': case '--help':
      return displayHelp();
    
    case 'to':
      return getLocation(args[1]);

    default:
      return;
  }
}

processArgs();
