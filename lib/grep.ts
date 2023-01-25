/// File-Search Modules
import { Binding } from './binding';
import { IQueryMatch } from './types';
import { IQueryOptions } from './options';

/** Grep Functionality. */
export namespace Grep {
    /********************
     *  PUBLIC METHODS  *
     ********************/

    /**
     * Constructs a synchronous file-search query grep.
     * @param root                          Root source to use.
     * @param input                         Search predicate.
     * @param options                       Options to use.
     */
    export const sync = (_source: string, _input: string | RegExp, _options: Partial<IQueryOptions>): IQueryMatch[] => {
        return [];
    };

    /**
     * Constructs an asychronous file-search query grep.
     * @param root                          Root source to use.
     * @param input                         Search predicate.
     * @param options                       Options to use.
     */
    export const stream = (
        _source: string,
        _input: string | RegExp,
        _options: Partial<IQueryOptions>
    ): Binding.IGenerator => {
        return { async *[Symbol.asyncIterator]() {} };
    };
}
