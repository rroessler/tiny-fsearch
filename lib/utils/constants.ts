//  HELPER METHODS  //

/**
 * Generates a random integer between two values.
 * @param max                               Maximum value.
 * @param min                               Minimum value.
 */
const rdint = (max: number, min: number = 0) => Math.floor(Math.random() * (max - min + 1) + min);

//  PROPERTIES  //

export const TEST_EMPTY_OUTPUT: number = 0;
export const TEST_EXPECTED_SIZE: number = 1;
export const TEST_LARGE_ITERS: number = 5;

export const TEST_PREDICATE: string = 'hello';
export const TEST_FORMATTER_VALUE = 'Goodbye';
export const TEST_BUFFER: string = 'Hello, World!';
export const TEST_FORMATTER_EXPECT: string = 'Goodbye, World!';

export const TEST_FORMATTER = (_: string, b: string, a: string) => b + TEST_FORMATTER_VALUE + a;

// pre-constructs a randomized large test instance
export const TEST_LARGE_VALUE: { buffer: Buffer; expected: number } = (() => {
    // prepare the total hits and times to match
    let hits = rdint(10_000);
    const lines = rdint(1000);
    const pred = `${TEST_PREDICATE} `;

    // evenly spread the search results
    const spread = Math.floor(hits / lines);

    // and construct the buffer necessary
    let buffer = Buffer.alloc(0);

    // join into one giant buffer
    for (let ii = 0; ii < lines; ++ii) buffer = Buffer.concat([buffer, Buffer.from(pred.repeat(spread) + '\n')]);

    // and finally return the details about the large test
    return { buffer, expected: spread * lines };
})();
