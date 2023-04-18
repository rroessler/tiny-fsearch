/// Library Modules
import test from 'ava';

/// FSearch Modules
import { FSearch } from '..';

/// FSearch Test Constants
import * as Constants from '../utils/constants';

/// Query Streamed Search.
test(`Query - default with "${Constants.TEST_PREDICATE}"`, async (_) => {
    // construct the parallel stream to be used
    const results = await FSearch.Stream.query(Constants.TEST_PREDICATE, { buffer: Constants.TEST_PREDICATE });

    // ensure we have our desired number of results
    _.is(results.length, Constants.TEST_EXPECTED_SIZE, 'Invalid result count');
});

/// Grep Streamed Search.
test(`Grep - default with "${Constants.TEST_PREDICATE}"`, async (_) => {
    // construct the parallel stream to be used
    const results = await FSearch.Stream.grep(Constants.TEST_PREDICATE, { buffer: Constants.TEST_PREDICATE });

    // ensure we have our desired number of results
    _.is(results.length, Constants.TEST_EXPECTED_SIZE, 'Invalid result count');
});
