/****************
 *  CORE TYPES  *
 ****************/

/// Search Hit Interface.
interface ISearchHit {
    content: string; // Hit Line Content.
    line: number; // Line Number of Hit.
    column: number; // Column of Hit.
}

/// "fsearch" MATCH structure.
interface ISearchMatch {
    filePath: string;
    hits: ISearchHit[];
}

/// "fsearch" options.
interface ISearchOptions {
    input: string; // Search String
    isRegex: boolean; // Using REGEX string
    matchCase: boolean; // Denotes to match case
    matchWholeWord: boolean; // Denotes matching whole words and not parts
    zeroIndexing: boolean; // Denotes using zero based indexing
}

/*************
 *  EXPORTS  *
 *************/

/**
 * Coordinates searching through a given selection of files for a desired string.
 * @param searchable                    A string to use for searching.
 * @param files                         File or Files to search through.
 * @param opts                          Search Options.
 */
export function fsearch(searchable: string | RegExp, files: string | string[], opts: ISearchOptions): ISearchMatch[];

/**
 * Coordinates searching through a given string or string buffer for a desired string.
 * @param searchable                    A string to use for searching.
 * @param source                        Source to search from.
 * @param opts                          Search Options.
 */
export function fquery(searchable: string | RegExp, source: string | Buffer, opts: ISearchOptions): ISearchMatch[];

/// Promisified versions of the available functions.
export namespace promises {
    /**
     * Coordinates searching through a given selection of files for a desired string. (PROMISIFED)
     * @param searchable                    A string to use for searching.
     * @param files                         File or Files to search through.
     * @param opts                          Search Options.
     */
    export function fsearch(
        searchable: string | RegExp,
        files: string | string[],
        opts: ISearchOptions
    ): Promise<ISearchMatch[]>;

    /**
     * Coordinates searching through a given string or string buffer for a desired string. (PROMISIFED)
     * @param searchable                    A string to use for searching.
     * @param source                        Source to search from.
     * @param opts                          Search Options.
     */
    export function fquery(
        searchable: string | RegExp,
        source: string | Buffer,
        opts: ISearchOptions
    ): Promise<ISearchMatch[]>;
}

export as namespace tiny;
