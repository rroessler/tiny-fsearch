/// Helper Requires
const path = require('path');

/// Require the desired items.
const { fsearch, fquery, promises } = require('..');

const fileResults = fsearch('Hello', path.join(__dirname, 'file.txt'));
const queryResults = fquery(/Hello/, 'Why hello there! Hello! Hello!');

console.log(fileResults);
console.log(queryResults);