// Core Binding Implementation
const _binding_raw = require('./build/Release/tfsearch.node');

/// Default Search Options.
const _defaultOptions = {
    isRegex: false,
    matchCase: false,
    matchWholeWord: false,
    zeroIndexing: false
};

/// RegExp verifier function.
const assertRegExpString = (input) => new RegExp(input);

const fsearch = (searchable, files, opts = {}) => {
    if (searchable instanceof RegExp) {
        searchable = searchable.source;
        opts.isRegex = true;
    }

    if (typeof files === 'string') files = [files];

    // if an error occurs creating the RegExp object, then is emitted
    if (opts.isRegex) assertRegExpString(searchable);

    opts = Object.assign(_defaultOptions, opts, { input: searchable });
    return _binding_raw._fsearch_impl(files, opts);
}

const fquery = (searchable, source, opts = {}) => {
    if (searchable instanceof RegExp) {
        searchable = searchable.source;
        opts.isRegex = true;
    }

    if (typeof source === 'string') source = Buffer.from(source);

    // if an error occurs creating the RegExp object, then is emitted
    if (opts.isRegex) assertRegExpString(searchable);


    opts = Object.assign(_defaultOptions, opts, { input: searchable });
    return _binding_raw._fquery_impl(source, opts);
}

/// EXPORTS
module.exports = {
    fsearch, fquery,
    promises: {
        fsearch: (...args) => new Promise(resolve => resolve(fsearch(...args))),
        fquery: (...args) => new Promise(resolve => resolve(fquery(...args)))
    }
};