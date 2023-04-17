/// Node Modules
import cp from 'child_process';

/// FSearch Modules
import { Match } from '../match';
import { Search } from '../generic';

/** Grep Shell Abstraction. */
export abstract class Abstract extends Search {
    //  PROPERTIES  //

    /** The base command instance. */
    abstract readonly command: string;

    /** Underlying shell instance to use. */
    protected abstract readonly m_shell?: string;

    //  PUBLIC METHODS  //

    /** Formatter for grep arguments. */
    abstract format(): string[];

    //  PRIVATE METHODS  //

    /** Coordinates running synchronous grepping. */
    protected m_sync(): Match.IResult[] {
        // prepare the actual command
        const cmd = [this.command].concat(this.format()).join(' ');

        // run the desired handler under a synchronous context
        const buffer = cp.execSync(cmd, { shell: this.m_shell });

        // and return the resulting transformed data
        return this.m_transform(buffer);
    }

    /** Coordinates running asynchronous grepping. */
    protected m_stream(): Promise<Match.IResult[]> {
        // prepare a queue for the incoming data chunks
        let data = Buffer.alloc(0);

        // generate the child process to be used
        const child = cp.spawn(this.command, this.format(), { shell: this.m_shell, stdio: 'pipe' });

        // prepare a handler to push values to the queue
        child.stdout?.on('data', (chunk) => (data = Buffer.concat([data, chunk])));

        // stop when necessary to do so
        return new Promise((resolve, reject) => {
            child.on('error', reject); // handle clear rejections immediately
            child.on('exit', () => resolve(this.m_transform(data)));
        });
    }

    /**
     * Coordinates parsing a "grep" result.
     * @param match                                 Match to parse.
     */
    protected m_parse(match: string): Pick<Match.IResult, 'line' | 'content'> {
        // pre-parse the grep output value
        const [, line, content] = match.match(/^(\d+):(.*)/) ?? [, '-1', match];

        // return the formatted result instance
        return { line: parseInt(line, 10), content };
    }

    /**
     * Helper method to transform queried data.
     * @param data                                  Data to output.
     */
    private m_transform(data: string | Buffer) {
        // convert the given data into a suitable set of lines
        const lines = (data instanceof Buffer ? data.toString() : data).split(/\r?\n/).filter((_) => _);

        // now we need to transform each of the lines as necessary
        return lines.slice(0, this.query.limit).reduce<Match.IResult[]>((results, match) => {
            // generate the base result instance
            const { line, content: original } = this.m_parse(match);

            // get all hits from the base match
            const hits = Array.from(original.matchAll(this.query.re));

            // push all the hits individually
            hits.forEach((hit, ii) => {
                // determine some details about the hit
                const offset = hit.index ?? 0;
                const rep = this.query.formatter(hit[0]);

                // reconstruct the content if necessary to do so
                const content = original.slice(0, offset) + rep + original.slice(offset + hit[0].length);

                // and append on the currently formatted instance
                results.push({ line, column: offset + 1, content });
            });

            // and ensure the accumulator is valid
            return results;
        }, []);
    }
}
