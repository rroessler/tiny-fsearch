/// Node Modules
import fs from 'fs';
import path from 'path';

/// Vendor Modules
import requirable from 'bindings';

/// File-Search Modules
import { IQueryMatch } from './types';
import { IQueryOptions } from './options';

/** Query Binding Functionality. */
export namespace Binding {
    /**************
     *  TYPEDEFS  *
     **************/

    /** The binding generator interface. */
    export interface IGenerator {
        [Symbol.asyncIterator](): AsyncIterator<IQueryMatch[]>;
    }

    /** The raw binding interface. */
    export interface IRaw {
        synchronous: (sources: string[], predicate: string, alternatives: NodeJS.Dict<Buffer>) => IQueryMatch[];
        Generator: { new (sources: string[], predicate: string, alternatives: NodeJS.Dict<Buffer>): IGenerator };
    }

    /********************
     *  PUBLIC METHODS  *
     ********************/

    /**
     * Constructs a synchronous file-search query binding.
     * @param root                          Root source to use.
     * @param input                         Search predicate.
     * @param options                       Options to use.
     */
    export const sync = (source: string, input: string | RegExp, options: Partial<IQueryOptions>): IQueryMatch[] => {
        // if the predicate is empty, then return immediately
        if (input === '') return [];

        // throw an error if the source does not exist
        if (!fs.existsSync(source)) throw new Error(`Query source "${source}" does not exist`);

        // resolve the default options to be used
        const params = Object.assign({}, IQueryOptions.defaults, options);
        const sources = IQueryOptions.Resolve.sources(path.resolve(source), params);
        const predicate = IQueryOptions.Resolve.predicate(input, params);
        const alternatives = IQueryOptions.Resolve.alternatives(sources, params);

        // get the base query binding
        return raw().synchronous(sources, predicate, alternatives);
    };

    /**
     * Constructs an asychronous file-search query binding.
     * @param root                          Root source to use.
     * @param input                         Search predicate.
     * @param options                       Options to use.
     */
    export const stream = (source: string, input: string | RegExp, options: Partial<IQueryOptions>) => {
        // if the input is empty, then return immediately
        if (input === '') return { async *[Symbol.asyncIterator]() {} };

        // throw an error if the source does not exist
        if (!fs.existsSync(source)) throw new Error(`Query source "${source}" does not exist`);

        // resolve the default options to be used
        const params = Object.assign({}, IQueryOptions.defaults, options);
        const sources = IQueryOptions.Resolve.sources(path.resolve(source), params);
        const predicate = IQueryOptions.Resolve.predicate(input, params);
        const alternatives = IQueryOptions.Resolve.alternatives(sources, params);

        // construct the generator to be used
        return new (raw().Generator)(sources, predicate, alternatives);
    };

    /** Gets the binding instance with the raw details. */
    export const raw = (): IRaw => requirable('fsearch');
}
