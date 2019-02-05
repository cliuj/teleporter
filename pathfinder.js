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
  if(path === null) {
    console.log("No directory path passed");
  } else {
    console.log("Dir: " + path + " not found!");
  }
}

function addLocation(key, path) {
  if (!fs.existsSync(path)) {
    return notFound(path); 
  }
  
  // check if key already exists
  db.get(key, function(err, value) {
    if(err) {
      if (err.notFound) {
        console.log("Key not found!");
        db.put(key, path);
        return
      }
      return callback(err);
    }
  });

  // if exists, ask for confirmation of overwriting it

}

function delLocation(key) {
  db.del(key, function(err) {
    if (err) {
      if (err.notFound) {
        console.log("Key not found!");
      }
    }
  });
}

function listLocations() {
  db.createReadStream()
    .on('data', function (data) {
      console.log(data.key, '=', data.value)
    })
    .on('error', function (err) {
      console.log('Oh my!', err)
    })
    .on('close', function () {
    })
    .on('end', function () {
    });
}

function displayHelp() {
  const help = 
    "Teleporter - a quick change directory script utilizing"
    + "\n             a database of directories and keys"
    + "\n"
    + "\nFormat:"
    + "\n1\ttp <key>"
    + "\n2\ttp <option>"
    + "\n3\ttp <option> <directory>"
    + "\n4\ttp <option> <key> <directory>"
    + "\n\n"
    + "\nUsage:"
    + "\nFormat:     Option:"
    + "\n"
    + "\n4          -a, --add       Maps the key to the directory and"
    + "\n                           adds it to the database"
    + "\n"
    + "\n5          -d, --delete    Removes the mapped key and directory from"   + "\n                           the database"
    + "\n"
    + "\n2          -l, --list      List all the keys and cooresponding directories" 
    + "\n                           from the database"
    + "\n"
    + "\n2          -h, --help      display the help(this) screen"

  ;

  console.log(help); 
}


function processArgs() {
  switch(args[0]) {

    case '-a': case '--add':

      // add a new location to tp to
      addLocation(args[1]);
      break;

    case '-d': case '--delete':

      // delete a saved tp location
      delLocation(args[1]);
      break;

    case '-l': case '--list':

      // list all the saved locations
      listLocations();
      break;

    case '-h': case '--help':
      displayHelp();
      break;

    default:
      console.log("default reached");
  }
}

processArgs()

