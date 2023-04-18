/// FSearch Modules
import { Grep } from './grep';
import { Match } from './match';
import { Query } from './query';
import { Source } from './source';
import { Search } from './generic';
import { Binding } from './binding';

/** File-Search Functionality. */
export namespace FSearch {
    //  TYPEDEFS  //

    /** File-Search Options Interface */
    export type Options = Query.IOptions & (Source.IBuffer | Source.IFilePath);

    /** Search Match Typing. */
    export type Result = Match.IResult;

    /** Generic Search Abstraction. */
    export type Generic = Search;
    export const Generic = Search;

    /** Wrapped Handler Function. */
    export type Executor<T extends Promise<Match.IResult[]> | Match.IResult[]> = (
        predicate: string | RegExp,
        options: Options
    ) => T;
}

export namespace FSearch.Sync {
    //  PUBLIC METHODS  //

    /**
     * Wraps a given search factory for synchronous searching.
     * @param factory                                   Factory to bind.
     */
    export const wrap =
        (factory: new (...args: ConstructorParameters<typeof Generic>) => Generic): Executor<Match.IResult[]> =>
        (predicate, options) => {
            // construct the search query
            const source = new Source(options);
            const query = new Query(predicate, options);

            // calculate the desired result now
            const result = new factory(source.filePath, query).sync();

            // remove the temporary file and run
            return source.dispose(), result;
        };

    /** Coordinates a "grep" query. */
    export const grep = wrap(Grep);

    /** Coorindates a "native" query. */
    export const query = wrap(Binding);
}

export namespace FSearch.Stream {
    //  PUBLIC METHODS  //

    /**
     * Wraps a given search factory for streamed searching.
     * @param factory                                   Factory to bind.
     */
    export const wrap =
        (
            factory: new (...args: ConstructorParameters<typeof Generic>) => Generic
        ): Executor<Promise<Match.IResult[]>> =>
        async (predicate, options) => {
            // construct the search query
            const source = new Source(options);
            const query = new Query(predicate, options);

            // calculate the desired result now
            return new factory(source.filePath, query).stream().finally(() => source.dispose());
        };

    /** Coordinates a "grep" query. */
    export const grep = wrap(Grep);

    /** Coorindates a "native" query. */
    export const query = wrap(Binding);
}
