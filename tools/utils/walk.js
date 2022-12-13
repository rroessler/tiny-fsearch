/// Node Modules
const fs = require('fs');
const path = require('path');

/** Helper method to resolve `darwin` paths. */
const m_resolve = (() => {
    const root = path.resolve(path.join(__dirname, '..') + '/');
    return (filePath) => (process.platform === 'darwin' ? filePath.replace(root, '') : filePath);
})();

/**
 * Coordinates walking through a directory and filtering out files required.
 * @param {string} directory                                    Directory to walk.
 * @param {string[]} extensions                                 Extensions to filter by.
 * @return {string[]}                                           Resulting filtered files.
 */
const rwalk = (directory, ...extensions) =>
    fs
        .readdirSync(directory)
        .map((filePath) => path.join(directory, filePath))
        .reduce((acc, filePath) => {
            if (fs.statSync(filePath).isDirectory()) return acc.concat(rwalk(filePath, ...extensions));
            else if (!extensions.includes(path.extname(filePath))) return acc;
            return [...acc, `"${m_resolve(filePath)}"`];
        }, []);

/// Export the recursive walker.
module.exports = { rwalk };
