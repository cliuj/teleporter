#!/usr/bin/env node

const fs = require('fs');
const { promisify } = require('util');
const readline = require('readline');
const db = require('./db');
const args = process.argv.slice(2);
