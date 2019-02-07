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

async function confirm() {
  let answer = false;
  rl.question[promisify.custom] = (arg) => {
    return new Promise((resolve) => {
      rl.question(arg, resolve);
    });
  };
  
  const ask = promisify(rl.question);
  await ask("Do you wish to continue? [y/N]: ")
    .then(ans => {
      if (ans.toLowerCase() === 'y') {
        answer = true;
      } else {
        answer = false;
      }
      rl.close();
    })
    .catch(err => {
      console.error(err);
    });
  return answer;
}

async function addDBLocation(key, path) {
  if (key === "toggled") {
    return console.log("Key: 'toggled' is a keyword!' It cannot be used.");
  }
  
  // check if the key exists
  await db.get(key, function(err) {
    if (err) {
      if (err.notFound) {
        return db.put(key, path);
      }
    }
  });

  console.log("Key already in-use. Continuing will overwrite the value of the key.");
  if (await confirm()) {
    return db.put(key, path);
  }
}

async function deleteDBLocation(key) {
  if (key === "toggled") {
    return console.log("'" + key + "'", "is a keyword! It cannot be deleted!");
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

function displayHelp() {
  
}

function processArgs() {
  if(debug) {
    console.log(args);
  }

  switch(args[0]) {
    case '-tc': case '--toggle-confirm':
      rl.close();
      return toggleConfirms();

    case '-a': case '--add':
      
      return addDBLocation(args[1], args[2]);

    case '-d': case '--delete':
      if (!args[1]) {
        rl.close();
        return console.log("No args passed");
      }
      rl.close();
      return deleteDBLocation(args[1]);

    case '-l': case '--list':
      rl.close();
      return listDBContents();
    
    case '-h': case '--help':
      rl.close();
      return displayHelp();

    default:
      console.log("default reached");
  }
}

function run() {
  checkToggled();
  processArgs();
}

run();

