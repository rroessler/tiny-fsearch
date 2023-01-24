/// File-Search Modules
import { Binding } from './binding';
import { IQueryMatch } from './types';
import { IQueryOptions } from './options';

/** File-Search Query Namespace. */
export namespace fsearch {
    /**************
     *  TYPEDEFS  *
     **************/

    /** Query Options Interface. */
    export interface IOptions extends IQueryOptions {}

    /** Base Query Result. */
    export interface IMatch extends IQueryMatch {}

    /********************
     *  PUBLIC METHODS  *
     ********************/

    /**
     * Constructs an asynchrous query generator.
     * @param source                                Source to query.
     * @param predicate                             Search predicate.
     * @param options                               Query options.
     */
    export const stream = (source: string, predicate: string | RegExp, options: Partial<IOptions> = {}) =>
        Binding.stream(source, predicate, options);

    /**
     * Gets the associated synchronous query result.
     * @param source                                Source to query.
     * @param predicate                             Search predicate.
     * @param options                               Query options.
     */
    export const sync = (source: string, predicate: string | RegExp, options: Partial<IOptions> = {}) =>
        Binding.sync(source, predicate, options);
}

/// Export the base namespace as a default.
export default fsearch;
