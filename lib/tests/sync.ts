/// Vendor Modules
import test from 'ava';

/// File-Search Imports
import fsearch from '..';

/// Defaulted query instance.
test('Query Sync - defaulted "hello"', (_) => {
    // get all available search results
    const results = fsearch.sync('lib', 'hello');

    // and ensure we have some
    _.is(results.length, 4, 'Invalid result count');
});
