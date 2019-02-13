#!/usr/bin/env node

const fs = require('fs');
const db = require('./db');
const args = process.argv.slice(2);

async function addDBLocation(key, value) {
  // check if dir exists
  fs.access(value, fs.constants.F_OK, (err) => {
    if (err && err.code === 'ENOENT') {
      return console.log("Directory does not exist!");
    }
  });


  let path;
  (value === '.') ? path = process.cwd() : path = value;
  
  await db.get(key, function(err) {
    if (err) {
      if (err.notFound) {
        return db.put(key, path);
      }
    }
  });
  return await db.put(key, path);
}

async function deleteDBLocation(key) {
  try {
    await db.del(key);
  } catch (err) {
    console.log("test");
    return console.log(err);
  }
}

async function getLocation(key) {
  try {
    const path = await db.get(key);
  } catch (err) {
    return console.log("Key not found");
  }
  return console.log(await db.get(key));
}

async function listDBContents() {
  console.log("Locations stored in DB:");
  await db.createReadStream()
    .on('data', function(data) {
      console.log(data.key, '-->', data.value)
    })
    .on('error', function(err) {
      console.log("Error occured when listing the contents of DB");
    })
  return;
}


function processArgs() {
  switch(args[0]) {
    case '-a': case '--add':
      return addDBLocation(args[1], args[2]);

    case '-d': case '--delete':
      if(!args[1]) {
        return console.log("No args passed");
      }
      return deleteDBLocation(args[1]);

    case '-l': case '--list':
      return listDBContents();

    case '-h': case '--help':
      return displayHelp();
    
    case 'to':
      return getLocation(args[1]);

    default:
      console.log("default reached!");
  }
}

processArgs();
