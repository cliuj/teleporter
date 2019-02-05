const fs = require('fs');

const db = require('./db');


const args = process.argv.slice(2);

function print_args() {
  for (let i = 0; i < args.length; ++i) {
    console.log(args[i]);
  }
}

function confirm() {
  console.log("Are you sure you wish to continue?");
}

function notFound(path) {
  console.log("Dir: " + path + " not found!");
}

function addLocation(key, path) {
  if (!fs.existsSync(path)) {
    return notFound(path); 
  }

}

function delLocation(key) {

}

function listLocations() {

}




function processArgs() {
  switch(args[0]) {

    case '-a': case '--add':

      // add a new location to tp to
      addLocation(args[1]);
      break;

    case '-d': case '--delete':

      // delete a saved tp location
      delLocation();
      break;

    case '-l': case '--list':

      // list all the saved locations
      listLocations();
      break;

    default:
      console.log("default reached");
  }
}



processArgs()

