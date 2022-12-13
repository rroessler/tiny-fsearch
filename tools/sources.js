/// Expected Source Files
module.exports = {
    sources: require('./utils/walk').rwalk('./src', '.cc', '.cpp').join(' '),
};
