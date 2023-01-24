/// Node Modules
import path from 'path';

/// Vendor Modules
import test from 'ava';

/// File-Search Imports
import fsearch from '..';

/// File-Search Utilities.
import * as Constants from '../utils/constants';

/// Synchronous Buffer Test.
test(`Query Sync - alternative "${Constants.TEST_PREDICATE}"`, (_) => {
    // prepare the buffer to be used
    const sequence = [...Array(4)].map(() => Constants.TEST_PREDICATE);
    const buffer = Buffer.from(sequence.join('\n'));

    // get all available search results
    const results = fsearch.sync('lib', Constants.TEST_PREDICATE, {
        alternatives: { [path.join(__dirname, '..', 'index.ts')]: buffer },
    });

    // and ensure we have some
    _.is(results.length, Constants.TEST_EXPECTED_LENGTH + sequence.length, 'Invalid result count');
});

/// Asynchronous Buffer Test.
test(`Query Async - alternative "${Constants.TEST_PREDICATE}"`, async (_) => {
    // prepare the buffer to be used
    const sequence = [...Array(4)].map(() => Constants.TEST_PREDICATE);
    const buffer = Buffer.from(sequence.join('\n'));

    // prepare the iteration counter
    let counter = 0;

    // get all available search results
    const stream = fsearch.stream('lib', Constants.TEST_PREDICATE, {
        alternatives: { [path.join(__dirname, '..', 'index.ts')]: buffer },
    });

    // iterate over the available matches
    for await (const matches of stream) counter += matches.length;

    // and ensure we have some
    _.is(counter, Constants.TEST_EXPECTED_LENGTH + sequence.length, 'Invalid result count');
});
