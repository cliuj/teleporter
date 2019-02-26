#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const db = require('./db');
const args = process.argv.slice(2);

function errorMsg(error) {
  console.error("Error:", error);
}

async function addDBLocation(key, path) {

  if (path.includes('..')) {
    return errorMsg(".. not allowed");
  }
  if (path === '.') {
    path = process.cwd();
  } else if (!path.includes(os.homedir())) {
    path = [process.cwd(), '/', path].join("");
  }

  const isValidDirPath = (path) => {
    return new Promise((resolve, reject) => {
      fs.stat(path, (err, data) => {
        if (err) {
          return reject("Path does not exist");
        }
        return resolve(data.isDirectory());
      });
    });
  };

  try {
    const valid = await isValidDirPath(path);
    if (!valid) {
      return errorMsg("not a valid directory path");
    }
    await db.put(key, path);
  } catch (err) {
    return errorMsg(err);
  } finally {
    await db.close();
  }
}

async function deleteDBLocation(key) {
  try {
    await db.del(key);
    return await db.close();
  } catch (err) {
    return errorMsg(err);
  }
  return;
}

async function renameDBKey(oldKey, newKey) {
  try {
    const path = await db.get(oldKey);
    await db.put(newKey, path);
    await db.del(oldKey);
    return await db.close();
  } catch (err) {
    return errorMsg("Unable to rename");
  }
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
    });
  return;
}

function displayHelp() {
  const help = [
    "Teleporter - A Node.js script for quick directory 'cd's"
    ,"\n"
    ,"             allowing users to 'teleport' to mapped directories",
    ,"\n"
    ,"\n"
    ,"Commands:    ","  tp ", " <option>"
    ,"\n"
    ,"\n"
    ,"Options: "
    ,"\n"
    ,"\n"
    ,"-a, --add    ","  tp <option> <key> <dir>    ", "  maps the passed key to the passed directory"
    ,"\n"
    ,"\n"
    ,"-d, --delete ","  tp <option> <key>          ", "  deletes the key and what it maps to from DB"
    ,"\n"
    ,"\n"
    ,"-r, --rename ","  tp <option> <okey> <nkey>  ", "  rename exsisting key to new passed name"
    ,"\n"
    ,"\n"
    ,"to           ","  tp <option> <key>          ", "  teleports(cd) to the dir where key is mapped"
    ,"\n"
    ,"\n"
    ,"-l, --list   ","  tp <option>                ", "  list the content(locations) stored in the DB"
    ,"\n"
    ,"\n"
    ,"-h, --help   ","  tp <option>                ", "  displays this"

  ].join("");

  return console.log(help);
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

    case '-r': case '--rename':
      if (!args[2]) {
        return errorMsg("Invalid arguments");
      }
      return renameDBKey(args[1], args[2]);

    case '-h': case '--help':
      return displayHelp();

    case 'to':
      return getLocation(args[1]);

    default:
      return errorMsg("No valid args passed. Use 'tp -h' for help");
  }
}

processArgs();
