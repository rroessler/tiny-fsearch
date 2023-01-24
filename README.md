# _tiny-fsearch_

Fast and Simple File Search for NodeJS. Versatile find-in-files/search methods that can take in a range of options.

## Getting Started

`tiny-fsearch` is a native Node module available via NPM. It can be installed with.

```bash
$ npm install --save tiny-fsearch
```

## Usage

The module consists of two available functions and a promisified alternative.

```javascript
const fsearch = require('tiny-fsearch');

/// Single-threaded query (returns all found matches).
fsearch.sync(source, predicate, options);

/// Multi-threaded query stream (returns an async iterator).
fsearch.stream(source, predicate, options);

/// Wraps `stream` in a promise wrapper for results.
fsearch.concurrent(source, predicate, options);
```

### Options

**source [string]**

A file or directory in which to search in.

**predicate [string|RegExp]**

The string or RegExp to use for matching.

**options [fsearch.IOptions]**

The available options exposed for setting different search parameters are:

```typescript
interface fsearch.IOptions {
    exclude: string[];          // File-globs to exclude from searching         (default: [])
    ignoreCase: boolean;        // Run a case-insensitive match                 (default: true)
    matchWholeWord: boolean;    // Wraps searches in a word-group boundary      (default: false)
}
```

### Results

Matched results with be in the form of:

```typescript
interface fsearch.IMatch {
    readonly line: number;
    readonly column: number;
    readonly length: number;
    readonly filePath: number;
}
```

## License

[MIT](https://opensource.org/licenses/MIT)
