/// Node Modules
import fs from 'fs';

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

    /** The expected binding arguments array. */
    export type Arguments = [sources: string[], predicate: string, alternatives: NodeJS.Dict<Buffer>, maximum: number];

    /** The raw binding interface. */
    export interface IRaw {
        synchronous: (...args: Arguments) => IQueryMatch[];
        Generator: { new (...args: Arguments): IGenerator };
    }

    /** Parallel Binding Interface. */
    export interface IParallel extends IGenerator {
        sources: string[];
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
        const { sources, predicate, alternatives, maximum } = IQueryOptions.Resolve.all(source, input, options);

        // get the base query binding
        return raw().synchronous(sources, predicate, alternatives, maximum);
    };

    /**
     * Constructs an asychronous file-search query binding.
     * @param root                          Root source to use.
     * @param input                         Search predicate.
     * @param options                       Options to use.
     */
    export const stream = (source: string, input: string | RegExp, options: Partial<IQueryOptions>): IParallel => {
        // if the input is empty, then return immediately
        if (input === '') return { async *[Symbol.asyncIterator]() {}, sources: [] };

        // throw an error if the source does not exist
        if (!fs.existsSync(source)) throw new Error(`Query source "${source}" does not exist`);

        // resolve the default options to be used
        const { sources, predicate, alternatives, maximum } = IQueryOptions.Resolve.all(source, input, options);

        // construct the generator to be used
        return Object.assign(new (raw().Generator)(sources, predicate, alternatives, maximum), { sources });
    };

    /** Gets the binding instance with the raw details. */
    export const raw = (): IRaw => requirable('fsearch');
}
