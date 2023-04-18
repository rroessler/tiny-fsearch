/// Library Modules
import test from 'ava';

/// FSearch Modules
import { FSearch } from '..';

/// FSearch Test Constants
import * as Constants from '../utils/constants';

/// Defaulted Query Instance.
test(`Query - default with "${Constants.TEST_PREDICATE}"`, (_) => {
    // get all available results from grepping
    const results = FSearch.Sync.query(Constants.TEST_PREDICATE, { buffer: Constants.TEST_PREDICATE });

    // and ensure we have the correct length
    _.is(results.length, Constants.TEST_EXPECTED_SIZE, 'Invalid result count');
});

/// Restricted Query Instance.
test(`Query - restricted with "${Constants.TEST_PREDICATE}"`, (_) => {
    // get all available results from grepping
    const results = FSearch.Sync.query(Constants.TEST_PREDICATE, {
        buffer: Constants.TEST_PREDICATE,
        limit: Constants.TEST_EMPTY_OUTPUT,
    });

    // and ensure we have the correct length
    _.is(results.length, Constants.TEST_EMPTY_OUTPUT, 'Invalid result count');
});

/// Query Synchronous Formatted.
test(`Query - formatted with "${Constants.TEST_FORMATTER_VALUE}"`, (_) => {
    // construct the parallel stream to be used
    const results = FSearch.Sync.query(Constants.TEST_PREDICATE, {
        buffer: Constants.TEST_BUFFER,
        formatter: Constants.TEST_FORMATTER,
    });

    // ensure we have our desired number of results
    _.is(results.length, Constants.TEST_EXPECTED_SIZE, 'Invalid result count');
    _.deepEqual(results[0].content, Constants.TEST_FORMATTER_EXPECT, 'Invalid formatter output');
});

/// Defaulted Grep Instance.
test(`Grep - default with "${Constants.TEST_PREDICATE}"`, (_) => {
    // get all available results from grepping
    const results = FSearch.Sync.grep(Constants.TEST_PREDICATE, { buffer: Constants.TEST_PREDICATE });

    // and ensure we have the correct length
    _.is(results.length, Constants.TEST_EXPECTED_SIZE, 'Invalid result count');
});

/// Restricted Grep Instance.
test(`Grep - restricted with "${Constants.TEST_PREDICATE}"`, (_) => {
    // get all available results, with a restricted maximum
    const results = FSearch.Sync.grep(Constants.TEST_PREDICATE, {
        buffer: Constants.TEST_PREDICATE,
        limit: Constants.TEST_EMPTY_OUTPUT,
    });

    // and ensure we have no values outputted
    _.is(results.length, Constants.TEST_EMPTY_OUTPUT, 'Expected no results');
});

/// Grep Synchronous Formatted.
test(`Grep - formatted with "${Constants.TEST_FORMATTER_VALUE}"`, (_) => {
    // construct the parallel stream to be used
    const results = FSearch.Sync.grep(Constants.TEST_PREDICATE, {
        buffer: Constants.TEST_BUFFER,
        formatter: Constants.TEST_FORMATTER,
    });

    // ensure we have our desired number of results
    _.is(results.length, Constants.TEST_EXPECTED_SIZE, 'Invalid result count');
    _.deepEqual(results[0].content, Constants.TEST_FORMATTER_EXPECT, 'Invalid formatter output');
});
