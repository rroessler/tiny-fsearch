/// FSearch Modules
import { Struct } from './utils/structure';

/** Search Query Wrapper. */
export class Query implements Required<Query.IOptions> {
    //  PROPERTIES  //

    /** The raw regular-express source string. */
    readonly source: string;

    /** The underlying source-predicate. */
    readonly predicate: string;

    /** Maximum match limit. */
    readonly limit: number = Infinity;

    /** Denotes if using regular exporessions. */
    readonly isRegExp: boolean = false;

    /** Whether to run case-sensitive matching */
    readonly ignoreCase: boolean = true;

    /** Coordinates formatting an matched value. */
    readonly formatter: Query.Formatter = (v, l, r) => l + v + r;

    /** Ensures only whole-word matches are valid. */
    readonly matchWholeWord: boolean = false;

    //  GETTERS x SETTERS  //

    /** Constructs a suitable regular expression for the query. */
    get re() {
        return new RegExp(this.predicate, 'g' + (this.ignoreCase ? 'i' : ''));
    }

    //  CONSTRUCTORS  //

    /**
     * Constructs a query instance.
     * @param options                       Query options.
     */
    constructor(input: string | RegExp, options: Query.IOptions = {}) {
        // determine if using regular exporession
        const isRegExp = input instanceof RegExp;

        // pre-set the regexp flag
        options.isRegExp = isRegExp;

        // save a copy of the raw input source
        this.source = isRegExp ? input.source : input;

        // ensure we properly assign the desired values
        Object.assign(this, Struct.pick(options, 'limit', 'ignoreCase', 'matchWholeWord', 'formatter'));

        // resolve some common details about the query instance as well
        this.predicate = Query.Resolve.predicate(this.source, this);
    }
}

export namespace Query {
    //  TYPEDEFS  //

    /** Format Replacer Ty[ing.] */
    export type Formatter = (match: string, before: string, after: string) => string;

    /** Options Interface for Search Queries. */
    export interface IOptions {
        limit?: number;
        isRegExp?: boolean;
        ignoreCase?: boolean;
        formatter?: Formatter;
        matchWholeWord?: boolean;
    }
}

export namespace Query.Resolve {
    //  PUBLIC METHODS  //

    /**
     * Resolves a queries predicate value.
     * @param input                             Search input string/pattern.
     * @param options                           Query instance to use.
     */
    export const predicate = (input: string, query: Query) => {
        // ensure the predicate we initially have is a valid string
        if (!query.isRegExp) input = input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // update based on the options we potentially have
        if (query.matchWholeWord) input = `\\b${input}\\b`;

        // and return the resulting predicate string
        return input;
    };
}
