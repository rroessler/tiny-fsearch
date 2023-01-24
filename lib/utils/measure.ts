/** Performance Functionality. */
export namespace Measure {
    /**************
     *  TYPEDEFS  *
     **************/

    /** The base callback method for measurements. */
    export type Method = () => any | Promise<any>;

    /** Measurement Results. */
    export interface IResult {
        slowest: bigint;
        fastest: bigint;
        average: bigint;
    }

    /********************
     *  PUBLIC METHODS  *
     ********************/

    /**
     * Formats a big-integer into "ss:ms:us".
     * @param value                     Value to format.
     */
    export const format = (value: bigint) => {
        const ms = value / 1_000_000n;
        const ss = ms / 1000n;

        // and format altogether based on the seconds gained
        return ss > 0n ? `${ss}.${(ms % 1000n).toString().padStart(4, '0')} seconds` : `${ms} ms`;
    };

    /**
     * Coordinates recording multiple performance measurements.
     * @param iters                     Iterations to perform.
     * @param callback                  Callback to measure.
     */
    export const record = async (iters: number, callback: Method): Promise<IResult> => {
        const values: bigint[] = []; // the current measurements

        // iteratively record instances
        for (let ii = 0; ii < iters; ++ii) {
            const start = process.hrtime.bigint();
            await callback(); // wait to finish
            values.push(process.hrtime.bigint() - start);
        }

        // and return the results
        return {
            slowest: values.reduce((m, v) => (m > v ? m : v)),
            fastest: values.reduce((m, v) => (m < v ? m : v)),
            average: values.reduce((ave, v) => ave + v, 0n) / BigInt(values.length),
        };
    };
}
