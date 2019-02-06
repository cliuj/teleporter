#!/usr/bin/env node

const fs = require('fs');
const { promisify } = require('util');
const readline = require('readline');
const db = require('./db');
const args = process.argv.slice(2);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.close();


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
    case '-l': case '--list':
      listDBContents();
      break;
    default:
      console.log("default reached");
  }
}

processArgs();
