/// Vendor Modules
import test from 'ava';

/// File-Search Imports
import fsearch from '..';

/// Defaulted query instance.
test('Query Async - defaulted "hello"', async (_) => {
    // construct the parallel stream to be used
    const stream = fsearch.stream('lib', 'hello');

    // prepare a counter for determining how many details we have
    let counter = 0;

    // iterable get the stream
    for await (const matches of stream) counter += matches.length;

    // ensure we have 4 results
    _.is(counter, 4, 'Invalid result count');
});
