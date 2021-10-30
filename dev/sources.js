// Native Modules
const fs = require('fs');
const path = require('path');

// Base CPP Extensions
const VALID_EXTENSIONS = [".cpp", ".cc"];

// Helper Walk Function
const walk = dir => {
    const out = [];

    const list = fs.readdirSync(dir);
    for (let item of list) {
        // if there is a vendor folder, then ignore
        if (item.includes('vendors')) continue;

        // resolve the path
        item = path.join(dir, item);

        // if a directory then traverse again
        if (fs.statSync(item).isDirectory()) out.push(...walk(item));
        else if (VALID_EXTENSIONS.includes(path.extname(item))) out.push(`"${item}"`);
    }

    // modify all items if on MacOS
    const BASE_DIR = path.join(__dirname, '../');
    if (process.platform === 'darwin') return out.map(item => item.replace(path.resolve(BASE_DIR) + "/", ''));

    // otherwise return as normal
    return out;
}

// Exporting the available CPP files
module.exports = { sources: walk(path.join(__dirname, '../src')).join(' ') };