/// Node Modules
import fs from 'fs';

/// Vendor Modules
import fg from 'fast-glob';

/** Query Options Interface. */
export interface IQueryOptions {
    readonly exclude: string[]; // exclude globs
    readonly ignoreCase: boolean; // whether to ignore case
    readonly matchWholeWord: boolean; // whole word to use
}

/** Available Query Options. */
export namespace IQueryOptions {
    /****************
     *  PROPERTIES  *
     ****************/

    /** Query Defaults Instance. */
    export const defaults: IQueryOptions = {
        exclude: [],
        ignoreCase: true,
        matchWholeWord: false,
    };
}

/** Query Options Resolvers. */
export namespace IQueryOptions.Resolve {
    /********************
     *  PUBLIC METHODS  *
     ********************/

    /**
     * Resolves a given query predicate.
     * @param predicate                         Search predicate.
     * @param options                           Query options.
     */
    export const predicate = (predicate: string | RegExp, { matchWholeWord }: IQueryOptions) => {
        // determine if we have regex or not
        if (typeof predicate === 'object') predicate = predicate.source;
        else predicate = predicate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // update the source based on the options found
        if (matchWholeWord) predicate = `\\b${predicate}\\b`;

        // return the resulting source string
        return predicate;
    };

    /**
     * Resolves all available sources to be used.
     * @param root                              Root source instance.
     * @param options                           Options to resolve from.
     */
    export const sources = (source: string, { exclude }: IQueryOptions) => {
        // prepare the required glob options
        const options: fg.Options = {
            dot: true,
            absolute: true,
            onlyFiles: true,

            cwd: source,
            ignore: exclude,
            caseSensitiveMatch: process.platform === 'linux',
        };

        // and determine what we need to return
        return fs.statSync(source).isDirectory() ? fg.sync(`**`, options) : [source];
    };
}
