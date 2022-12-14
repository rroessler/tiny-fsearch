/// Node Modules
import fs from 'fs';
import path from 'path';

/// Vendor Modules
import requirable from 'bindings';

/// File-Search Modules
import { IQueryOptions } from './options';
import { IQueryMatch } from './types';

/** Query Binding Functionality. */
export namespace Binding {
    /**************
     *  TYPEDEFS  *
     **************/

    /** Raw Query Binding Interface. */
    export interface IRaw {
        // attempts getting all match queries
        sync: () => IQueryMatch[];

        // gets the next available query match
        next: (callback: (match: IQueryMatch | undefined) => void) => void;
    }

    /********************
     *  PUBLIC METHODS  *
     ********************/

    /**
     * Constructs a raw file-search query binding.
     * @param root                          Root source to use.
     * @param predicate                     Search predicate.
     * @param options                       Options to use.
     */
    export const create = (source: string, predicate: string | RegExp, options: Partial<IQueryOptions>) => {
        // throw an error if the source does not exist
        if (!fs.existsSync(source)) throw new Error(`Query source "${source}" does not exist`);

        // resolve the default options to be used
        const params = Object.assign({}, IQueryOptions.defaults, options);

        // get the base query binding
        const { _Query_impl } = requirable('fsearch');

        // and create the required binding
        return new _Query_impl(
            IQueryOptions.Resolve.sources(path.resolve(source), params),
            IQueryOptions.Resolve.predicate(predicate, params)
        ) as IRaw;
    };
}
