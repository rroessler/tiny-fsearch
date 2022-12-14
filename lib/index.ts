/// File-Search Modules
import { Binding } from './binding';
import { IQueryMatch } from './types';
import { IQueryOptions } from './options';

/** File-Search Query Namespace. */
export namespace fsearch.Query {
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
    export const bind = (source: string, predicate: string | RegExp, options: Partial<IOptions> = {}) => {
        // construct a new underlying binding instance
        const binding = Binding.create(source, predicate, options);
        const getter = () => new Promise<IMatch | undefined>((resolve) => binding.next(resolve));

        // and create the enclosed async generator
        return async function* (): AsyncGenerator<IMatch, void> {
            // get the initial match instance
            let match = await getter();

            // and attempt getting more
            while (typeof match !== 'undefined') {
                yield match;
                match = await getter();
            }
        };
    };

    /**
     * Gets the associated synchronous query result.
     * @param source                                Source to query.
     * @param predicate                             Search predicate.
     * @param options                               Query options.
     */
    export const sync = (source: string, predicate: string | RegExp, options: Partial<IOptions> = {}): IMatch[] =>
        Binding.create(source, predicate, options).sync();
}

/// Export the base namespace as a default.
export default fsearch;
