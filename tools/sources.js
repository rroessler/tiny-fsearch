/// Expected Source Files
module.exports = {
    sources: require('./walk').rwalk('./src', '.cc', '.cpp').join(' ')
};
