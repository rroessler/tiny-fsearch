/// Vendor Modules
import test from 'ava';

/// File-Search Imports
import fsearch from '..';

/// File-Search Utilities
import { Measure } from '../utils/measure';

test('Query Speed', async (_) => {
    // prepare the desired options to be used
    const cwd: string = process.cwd();
    const predicate: string = 'time';
    const options = { exclude: [] };

    // propose a number of iterations to complete
    const iters: number = 1;

    // determine the synchronous time that occured
    const synchronous = await Measure.record(iters, () => fsearch.sync(cwd, predicate, options));

    // and now test the parallel time that occured
    const parallel = await Measure.record(iters, async () => {
        // build the base stream
        const stream = fsearch.stream(cwd, predicate, options);

        // alert about the total files to be searched
        _.log('Files to search:', stream.sources.length);

        // and attempt searching as necessary
        for await (const _ of stream) void 0;
    });

    // get the fastest and slowest averags to be shown
    const [fastest, slowest] =
        parallel.average < synchronous.average ? [parallel, synchronous] : [synchronous, parallel];

    // time less than other
    const reference = (100 * Number(fastest.average - slowest.average)) / Number(slowest.average);
    const percentage = `| ${reference.toFixed(2)}%`;

    // emit a log about the relative size and times required
    _.log('Parallel:', Measure.format(parallel.average));
    _.log('Synchronous:', Measure.format(synchronous.average));

    // determine which one was fastest
    _.log('Fastest:', parallel.average < synchronous.average ? 'Parallel' : 'Synchronous', percentage);

    // pass-through as only concerned about the values
    _.assert(true);
});
