/// FSearch Modules
import { Query } from './query';
import { Source } from './source';
import { Grep as G } from './grep';

/** File-Search Functionality. */
export namespace FSearch {
    //  TYPEDEFS  //

    /** File-Search Options Interface */
    export type Options = Query.IOptions & (Source.IBuffer | Source.IFilePath);

    /** Stream Handler Interface. */
    export interface IStream {
        callback: (match: any) => any;
    }

    //  PUBLIC METHODS  //

    /**
     * Coordinates synchronous file-searching.
     * @param predicate                             Query predicate.
     * @param options                               Search options.
     */
    export const sync = (predicate: string | RegExp, options: Options) => {
        // construct the search query
        const query = new Query(predicate, options);
        const source = new Source(options);

        // coordinate some validation as necessary
    };
}

export namespace FSearch.Grep {
    //  PUBLIC METHODS  //

    /**
     * Coordinates grepping for search results synchronously.
     * @param predicate                             Query predicate.
     * @param options                               Search options.
     */
    export const sync = (predicate: string | RegExp, options: Options) => {
        const source = new Source(options);
        const query = new Query(predicate, options);

        // calculate the desired synchronous result
        const result = new G(source.filePath, query).sync();

        // dispose of the source and return the result
        return source.dispose(), result;
    };

    /**
     * Coordinates grepping for search results asynchronously.
     * @param predicate                             Query predicate.
     * @param options                               Search options.
     */
    export const stream = async (predicate: string | RegExp, options: Options & IStream) => {
        const source = new Source(options);
        const query = new Query(predicate, options);

        // calculate the desired synchronous result and dispose of the source after
        return new G(source.filePath, query).stream().finally(() => source.dispose());
    };
}
