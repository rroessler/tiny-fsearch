/// FSearch Modules
import { Match } from './match';
import { Query } from './query';

/** Generic Search Interface. */
export abstract class Search {
    //  CONSTRUCTORS  //

    /**
     * Constructs a simplified shell handler for grepping.
     * @param filePath                          File to grep.
     * @param query                             Query instance.
     */
    constructor(readonly filePath: string, readonly query: Query) {}

    //  PUBLIC METHODS  //

    /** Coordinates a synchronous search instance. */
    sync(): Match.IResult[] {
        return this.query.limit > 0 ? this.m_sync() : [];
    }

    /** Coordinates a streamed search instance. */
    stream(): Promise<Match.IResult[]> {
        return this.query.limit > 0 ? this.m_stream() : Promise.resolve([]);
    }

    //  PRIVATE METHODS  //

    /** Inheritable synchronous search handler. */
    protected abstract m_sync(): Match.IResult[];

    /** Inheritable streamed search handler. */
    protected abstract m_stream(): Promise<Match.IResult[]>;
}
