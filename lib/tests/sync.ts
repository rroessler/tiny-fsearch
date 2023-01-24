/// Vendor Modules
import test from 'ava';

/// File-Search Imports
import fsearch from '..';

/// File-Search Utilities.
import * as Constants from '../utils/constants';

/// Defaulted query instance.
test(`Query Sync - defaulted "${Constants.TEST_PREDICATE}"`, (_) => {
    // get all available search results
    const results = fsearch.sync('lib', Constants.TEST_PREDICATE);

    // and ensure we have some
    _.is(results.length, Constants.TEST_EXPECTED_LENGTH, 'Invalid result count');
});
