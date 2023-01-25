/// Vendor Modules
import test from 'ava';

/// File-Search Imports
import fsearch from '..';

/// File-Search Utilities.
import * as Constants from '../utils/constants';

/// Defaulted query instance.
test(`Query Async - defaulted "${Constants.TEST_PREDICATE}"`, async (_) => {
    // construct the parallel stream to be used
    const stream = fsearch.stream('lib', Constants.TEST_PREDICATE);

    // prepare a counter for determining how many details we have
    let counter = 0;

    // iterable get the stream
    for await (const matches of stream) counter += matches.length;

    // ensure we have 4 results
    _.is(counter, Constants.TEST_EXPECTED_LENGTH, 'Invalid result count');
});

/// Restricted query instance.
test(`Query Async - restricted "${Constants.TEST_PREDICATE}"`, async (_) => {
    // construct the parallel stream to be used
    const stream = fsearch.stream('lib', Constants.TEST_PREDICATE, { maximum: 0 });

    // prepare a counter for determining how many details we have
    let counter = 0;

    // iterable get the stream
    for await (const matches of stream) counter += matches.length;

    // ensure we have 4 results
    _.is(counter, 0, 'Invalid result count');
});
