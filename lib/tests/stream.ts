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

/// Query Streamed Formatted.
test(`Query - formatted with "${Constants.TEST_FORMATTER_VALUE}"`, async (_) => {
    // construct the parallel stream to be used
    const results = await FSearch.Stream.query(Constants.TEST_PREDICATE, {
        buffer: Constants.TEST_BUFFER,
        formatter: Constants.TEST_FORMATTER,
    });

    // ensure we have our desired number of results
    _.is(results.length, Constants.TEST_EXPECTED_SIZE, 'Invalid result count');
    _.deepEqual(results[0].content, Constants.TEST_FORMATTER_EXPECT, 'Invalid formatter output');
});

/// Grep Streamed Search.
test(`Grep - default with "${Constants.TEST_PREDICATE}"`, async (_) => {
    // construct the parallel stream to be used
    const results = await FSearch.Stream.grep(Constants.TEST_PREDICATE, { buffer: Constants.TEST_PREDICATE });

    // ensure we have our desired number of results
    _.is(results.length, Constants.TEST_EXPECTED_SIZE, 'Invalid result count');
});

/// Grep Streamed Formatted.
test(`Grep - formatted with "${Constants.TEST_FORMATTER_VALUE}"`, async (_) => {
    // construct the parallel stream to be used
    const results = await FSearch.Stream.grep(Constants.TEST_PREDICATE, {
        buffer: Constants.TEST_BUFFER,
        formatter: Constants.TEST_FORMATTER,
    });

    // ensure we have our desired number of results
    _.is(results.length, Constants.TEST_EXPECTED_SIZE, 'Invalid result count');
    _.deepEqual(results[0].content, Constants.TEST_FORMATTER_EXPECT, 'Invalid formatter output');
});
