/// Library Modules
import requirable from 'bindings';

/// FSearch Modules
import { Match } from '../match';
import { Query } from '../query';
import { Search } from '../generic';

/** Node-Addon Wrapper Class. */
export class Binding extends Search {
    //  PRIVATE METHODS  //

    /** Formats the underlying binding arguments to be used. */
    private m_format(): Binding.Arguments {
        const { predicate, ignoreCase, limit } = this.query;
        return [this.filePath, predicate, ignoreCase, limit];
    }

    /** Synchronous search implementation. */
    protected m_sync(): Match.IResult[] {
        return this.m_transform(Binding.API().sync(...this.m_format()));
    }

    /** Streamed search implementation. */
    protected async m_stream() {
        return Binding.API()
            .stream(...this.m_format())
            .then(this.m_transform.bind(this));
    }

    /**
     * Transforms binding results to match results.
     * @param results                                   Results to transform.
     */
    private m_transform(results: Binding.IResult[]): Match.IResult[] {
        return results.map(({ line, column, value, content }) => {
            // prepare an initial output value and return if no formatter
            const output: Match.IResult = { line, column, content };
            if (typeof this.query.formatter === 'undefined') return output;

            // otherwise reformat the content instance
            const before = content.slice(0, column - 1);
            const after = content.slice(column + value.length - 1);
            output.content = this.query.formatter(value, before, after);

            // return the resulting value
            return output;
        });
    }
}

export namespace Binding {
    //  TYPEDEFS  //

    /** Binding Result Interface. */
    export interface IResult extends Match.IResult {
        value: string;
    }

    /** Binding Input Arguments. */
    export type Arguments = [filePath: string, predicate: string, ignoreCase: boolean, maximum: number];

    /** Stream Generator Typing. */
    export interface IStreamGenerator {
        [Symbol.iterator]: Iterator<Promise<IResult[]>>;
    }

    /** Binding Exports Interface. */
    export interface IExports {
        sync(...args: Arguments): IResult[];
        stream: (...args: Arguments) => Promise<IResult[]>;
    }

    //  PUBLIC METHODS  //

    /** Gets the underlying API binding. */
    export const API = (): IExports => requirable('fsearch');
}
