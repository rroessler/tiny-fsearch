/** Measure Functionality. */
export namespace Measure {
    //  TYPEDEFS  //

    /** Function Handler Typing. */
    export type Callback<R extends unknown | Promise<unknown>> = () => R;

    /** Results Interface. */
    export interface IResults {
        slowest: bigint;
        fastest: bigint;
        average: bigint;
    }

    //  PUBLIC METHODS  //

    /**
     * Coordinates measuring a function.
     * @param iters                             Iterations to perform.
     * @param callback                          Function to measure.
     */
    export const record = <R extends unknown | Promise<unknown>>(
        iters: number,
        callback: Callback<R>
    ): R extends Promise<any> ? Promise<IResults> : IResults => {
        // prepare an instance for current measurements
        const samples: bigint[] = [];
        const promises: Promise<any>[] = [];

        // iteratively record results
        for (let ii = 0; ii < iters; ++ii) {
            const start = process.hrtime.bigint();
            const result = callback();
            const promisifed = result instanceof Promise;

            // handle based on promisified or non-promisifed results
            if (promisifed) promises.push(result.then(() => samples.push(process.hrtime.bigint() - start)));
            else samples.push(process.hrtime.bigint() - start);
        }

        // return the results as necessary
        return (promises.length ? Promise.all(promises).then(() => m_resolve(samples)) : m_resolve(samples)) as any;
    };

    //  PRIVATE METHODS  //

    /**
     * Helper method to resolve results after recording.
     * @param samples                               Samples to resolve.
     */
    const m_resolve = (samples: bigint[]): IResults => ({
        slowest: samples.reduce((m, v) => (m > v ? m : v), BigInt(0)),
        fastest: samples.reduce((m, v) => (m < v ? m : v), BigInt(0)),
        average: samples.reduce((a, v) => a + v, BigInt(0)) / BigInt(samples.length),
    });
}
