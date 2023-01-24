# _tiny-fsearch_

Fast and Simple File Search for NodeJS. Versatile find-in-files/search methods that can take in a range of options.

## Getting Started

`tiny-fsearch` is a native Node module available via NPM. It can be installed with.

```bash
$ npm install --save tiny-fsearch
```

## Usage

The module consists of two available functions and promisified alternatives.

```javascript
const tiny = require('tiny-fsearch');

/// File searching.
tiny.fsearch(searchable, filePaths, options);

/// Source String/Buffer query method.
tiny.fquery(searchable, source, options);

/// Promisified alternatives
tiny.promises.fsearch(...);
tiny.promises.fquery(...);
```

**searchable [string|RegExp]**

The string or RegExp to use for matching.

**filePaths [string|string[]]**

A file or file-paths to coordinate searching from (`fsearch` only).

**source [string|Buffer]**

A source string or NodeJS Buffer to search from (`fquery` only).

**options [object]**

The available options exposed for setting different search parameters.

```typescript
interface ISearchOptions {
    isRegex: boolean; // Denotes is using RegExp string. Toggled true if method is given RegExp object as searchable.
    matchCase: boolean; // Case sensitivity of searching.
    matchWholeWord: boolean; // Wraps internal RegExp logic with zero-width boundary characters (\b).
    zeroIndexing: boolean; // Returns results with zero-indexing.
}
```

Both functions return similar hit-based results. For the `fsearch` implementation a series of results will be return in an array, where as the `fquery` returns only a singular result. The format of a search result is:

```typescript
interface ISearchMatch {
    filePath: string; // `fsearch` only.
    hits: {
        content: string; // Line content of match.
        line: number; // Originating line number.
        column: number; // Originating column number.
    }[];
}
```

## License

[MIT](https://opensource.org/licenses/MIT)
