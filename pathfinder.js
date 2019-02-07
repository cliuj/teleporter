#!/usr/bin/env node
const fs = require('fs');
const { promisify } = require('util');
const readline = require('readline');
const db = require('./db');
const args = process.argv.slice(2);

const debug = true;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.close();

async function checkToggled() {
  await db.get('toggled', function (err, value) {
    if(err){
      if(err.notFound) {
        console.log("toggled key not found");
        return;
      }
    }
  });
  await db.put('toggled', true);
}

async function toggleConfirms() {
  try {
    const toggled = (await db.get("toggled") === 'true');
    if (toggled) {
      await db.put("toggled", false);
    } else {
      await db.put("toggled", true);
    }
  } catch(err) {
    console.error(err);
  }

  if (debug) {
    console.log("Toggle status:", await db.get("toggled"));
  }
}

async function deleteDBLocation(key) {
  if (key === "toggled") {
    return console.log("'" + key + "'", "is a keyword, so it cannot be deleted!");
  }

  await db.del(key, function(err) {
    if (err) {
      if (err.notFound) {
        console.log("Key not found!");
      }
    }
  });
}


async function listDBContents() {
  await db.createReadStream()
    .on('data', function (data) {
      console.log(data.key, '=', data.value)
    })
    .on('error', function (err) {
      console.log('Oh my!', err)
    })
}

function processArgs() {
  switch(args[0]) {
    case '-tc': case '--toggle-confirm':
      return toggleConfirms();

    case '-d': case '--delete':
      if (!args[1]) {
        return console.log("No args passed");
      }
      return deleteDBLocation(args[1]);

    case '-l': case '--list':
      return listDBContents();

    default:
      console.log("default reached");
  }
}

function run() {
  checkToggled();
  processArgs();
}

run();

