# teleporter

A **'cd'** script written in Node.js and bash. Users may map any key to their directories. These `key` => `dir` pairs are stored inside LevelDB for quick retrieval.

Hopefully this reduces the number times one must press tab and type `cd` to enter directories.

## Setup

Given the nature of how scripts/programs are typically executed in a child process, `cd`s in scripts/programs do not exactly last after completion. 
**Note** The reference to `teleporter` below is the actual file called **teleporter**

Here's a list of things that should be taken into consideration:
* Make **symlinks** of **teleporter** and **pathfinder.js** and place them inside `~/scripts/` or where ever , but make sure that call to **pathfinder.js** is in the same directory specified in **teleporter**
* Source **teleporter** symlink or actual (**MUST DO** or else `cd` of `pwd` does not stay after execution completion)


## Usage

```
Commands:      tp  <option>

Options: 

-a, --add      tp <option> <key> <dir>      maps the passed key to the passed directory

-d, --delete   tp <option> <key>            deletes the key and what it maps to from DB

-r, --rename   tp <option> <okey> <nkey>    rename exsisting key to new passed name

to             tp <option> <key>            teleports(cd) to the dir where key is mapped

-l, --list     tp <option>                  list the content(locations) stored in the DB

-h, --help     tp <option>                  displays this 

```
