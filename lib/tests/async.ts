/// Vendor Modules
import test from 'ava';

/// File-Search Imports
import fsearch from '..';

/// Defaulted query instance.
test('Query Async - defaulted "hello"', async (_) => {
    // get all available search results
    const query = fsearch.Query.bind('lib', 'hello')();

    // current hit counter
    let count = 0;

    // iterate over all the query results
    for await (const _ of query) {
        count++; // increment the current count
    }

    // ensure we have 4 results
    _.is(count, 4, 'Invalid result count');
});
