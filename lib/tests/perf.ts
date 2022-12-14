/// Vendor Modules
import test from 'ava';

/// File-Search Imports
import fsearch from '..';

test('Query Speed', (_) => {
    // get the current execution time
    const start = process.hrtime.bigint();

    // run the search instance
    fsearch.Query.sync('src', 'time', { exclude: ['node_modules/**'] });

    // stop the execution timer
    const duration = process.hrtime.bigint() - start;

    // and read the current time out
    console.log({ duration });

    _.assert(true);
});
