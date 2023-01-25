/// Node Modules
import fs from 'fs';
import path from 'path';

/// Vendor Modules
import fg from 'fast-glob';

/** Query Options Interface. */
export interface IQueryOptions {
    readonly exclude: string[]; // exclude globs
    readonly ignoreCase: boolean; // whether to ignore case
    readonly matchWholeWord: boolean; // whole word to use
    readonly maximum: number; // maximum number of values
    readonly alternatives: NodeJS.Dict<Buffer>; // source alternatives
}

/** Available Query Options. */
export namespace IQueryOptions {
    /****************
     *  PROPERTIES  *
     ****************/

    /** Query Defaults Instance. */
    export const defaults: IQueryOptions = {
        ignoreCase: true,
        matchWholeWord: false,
        maximum: Number.MAX_SAFE_INTEGER,

        exclude: [],
        alternatives: {},
    };
}

/** Query Options Resolvers. */
export namespace IQueryOptions.Resolve {
    /**************
     *  TYPEDEFS  *
     **************/

    /** Resolution Value Interface. */
    export interface IValue {
        maximum: number;
        sources: string[];
        predicate: string;
        alternatives: NodeJS.Dict<Buffer>;
    }

    /********************
     *  PUBLIC METHODS  *
     ********************/

    /**
     * Constructs all the required search options.
     * @param root                              Root source to use.
     * @param input                             Search predicate.
     * @param options                           Options to use.
     */
    export const all = (source: string, input: string | RegExp, options: Partial<IQueryOptions>): IValue => {
        // resolve the default options to be used
        const params = Object.assign({}, defaults, options);
        const sources = m_sources(path.resolve(source), params);

        // and return the resulting details
        return {
            sources,
            maximum: params.maximum,
            predicate: m_predicate(input, params),
            alternatives: m_alternatives(sources, params),
        };
    };

    /*********************
     *  PRIVATE METHODS  *
     *********************/

    /**
     * Resolves a given query predicate.
     * @param predicate                         Search predicate.
     * @param options                           Query options.
     */
    const m_predicate = (predicate: string | RegExp, { matchWholeWord }: IQueryOptions) => {
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
    const m_sources = (source: string, { exclude }: IQueryOptions) => {
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

    /**
     * Resolves all available alternative buffers.
     * @param sources                           Sources to filter with.
     * @param options                           Options to resolve from.
     */
    const m_alternatives = (sources: string[], { alternatives: _ }: IQueryOptions) => {
        // remove all invalid keys that we do not need
        for (const key in Object.keys(_)) !sources.includes(key) && delete _[key];

        // and finally return the result
        return _;
    };
}
