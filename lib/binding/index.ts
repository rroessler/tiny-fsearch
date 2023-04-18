/// Library Modules
import requirable from 'bindings';

/// FSearch Modules
import { Match } from '../match';
import { Search } from '../generic';

/** Node-Addon Wrapper Class. */
export class Binding extends Search {
    //  PRIVATE METHODS  //

    /** Formats the underlying binding arguments to be used. */
    private m_format(): Binding.Arguments {
        return [this.filePath, this.query.predicate, this.query.ignoreCase, this.query.limit];
    }

    /** Synchronous search implementation. */
    protected m_sync(): Match.IResult[] {
        return Binding.API().sync(...this.m_format());
    }

    /** Streamed search implementation. */
    protected async m_stream(): Promise<Match.IResult[]> {
        // construct the underlying stream instance to be used
        const generator = new (Binding.API().StreamGenerator)(...this.m_format());

        // and recombine all the desired streamed results
        return Promise.all(Array.from(generator)).then((results) => results.flat());
    }
}

export namespace Binding {
    //  TYPEDEFS  //

    /** Binding Input Arguments. */
    export type Arguments = [filePath: string, predicate: string, ignoreCase: boolean, maximum: number];

    /** Stream Generator Typing. */
    export interface IStreamGenerator {
        [Symbol.iterator]: Iterator<Promise<Match.IResult[]>>;
    }

    /** Binding Exports Interface. */
    export interface IExports {
        sync(...args: Arguments): Match.IResult[];
        StreamGenerator: new (...args: Arguments) => Generator<Promise<Match.IResult[]>, void>;
    }

    //  PUBLIC METHODS  //

    /** Gets the underlying API binding. */
    export const API = (): IExports => requirable('fsearch');
}
