const level = require('level');
const path = require('path');

const dbPath = path.join(__dirname, 'locationsdb');
let db = level(dbPath);

module.exports = db;
