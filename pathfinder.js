#!/usr/bin/env node

const fs = require('fs');
const db = require('./db');
const args = process.argv.slice(2);

async function addDBLocation(key, path) {
  // check if dir exists

  await db.get(key, function(err) {
    if (err) {
      if (err.notFound) {
        return db.put(key, path);
      }
    }
  });
  return db.put(key, path);
}

async function deleteDBLocation(key) {
  await db.del(key, function(err) {
    if (err) {
      if (err.notFound) {
        return console.log("Key not found!");
      }
    }
  });
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
