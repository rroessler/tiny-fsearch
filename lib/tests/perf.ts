/// Library Modules
import test, { ExecutionContext } from 'ava';

/// FSearch Modules
import { FSearch } from '..';

/// FSearch Test Constants
import { Measure } from '../utils/measure';
import * as Constants from '../utils/constants';

//  TYPEDEFS  //

/** Measure Interface Typing. */
interface IMeasurable {
    sync: FSearch.Executor<FSearch.Result[]>;
    stream: FSearch.Executor<Promise<FSearch.Result[]>>;
}

//  HELPER METHODS  //

/**
 * Coordinates handling measurement tasks.
 * @param provider                              Provider interfaces to use.
 * @param _                                     AVA execution context.
 */
const measure = async (provider: IMeasurable, _: ExecutionContext) => {
    // prepare the arguments to be used
    const args = [Constants.TEST_PREDICATE, { buffer: Constants.TEST_LARGE_VALUE.buffer }] as const;

    // measure the synchronous handler
    const sync = Measure.record(Constants.TEST_LARGE_ITERS, () => provider.sync(...args));
    const stream = await Measure.record(Constants.TEST_LARGE_ITERS, () => provider.stream(...args));

    // determine which is fastest and slowest
    const [fastest, slowest] = sync.average < stream.average ? [sync, stream] : [stream, sync];

    // calculate the percentage faster
    const ref = (BigInt(100) * (slowest.average - fastest.average)) / slowest.average;
    const percentage = ref.toString(10);

    // emit logs about the speed details
    _.log('Sync:', sync.average);
    _.log('Stream:', stream.average);

    // determine which was fastest
    _.log(`Fastest: ${stream.average < sync.average ? 'Streamed' : 'Synced'} | ${percentage + '%'}`);

    // always pass this instance
    _.pass();
};

//  TEST RUNNERS  //

test('Query Speed', async (_) => measure({ sync: FSearch.Sync.query, stream: FSearch.Stream.query }, _));
test('Grep Speed', async (_) => measure({ sync: FSearch.Sync.grep, stream: FSearch.Stream.grep }, _));
