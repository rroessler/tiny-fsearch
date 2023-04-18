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
        const { predicate, ignoreCase, limit, formatter } = this.query;
        return [this.filePath, predicate, ignoreCase, limit, formatter];
    }

    /** Synchronous search implementation. */
    protected m_sync(): Match.IResult[] {
        return Binding.API().sync(...this.m_format());
    }

    /** Streamed search implementation. */
    protected async m_stream(): Promise<Match.IResult[]> {
        return Binding.API().stream(...this.m_format());
    }
}

export namespace Binding {
    //  TYPEDEFS  //

    /** Binding Input Arguments. */
    export type Arguments = [
        filePath: string,
        predicate: string,
        ignoreCase: boolean,
        maximum: number,
        formatter?: Query.Formatter
    ];

    /** Stream Generator Typing. */
    export interface IStreamGenerator {
        [Symbol.iterator]: Iterator<Promise<Match.IResult[]>>;
    }

    /** Binding Exports Interface. */
    export interface IExports {
        sync(...args: Arguments): Match.IResult[];
        stream: (...args: Arguments) => Promise<Match.IResult[]>;
    }

    //  PUBLIC METHODS  //

    /** Gets the underlying API binding. */
    export const API = (): IExports => requirable('fsearch');
}
