# *tiny-fsearch*

Fast and simple file-in-file methods for NodeJS.

## Getting Started

`tiny-fsearch` exposes both a native Node module and cross-platform [grep](https://en.wikipedia.org/wiki/Grep) functionality. It can be installed via:

```bash
npm install tiny-fsearch
```

## Usage

The module consists of both "sycnhronous" and "streamed" match outputs for single find-in-file queries.

```typescript
// ES Syntax (other require is fine for CommonJS)
import { FSearch } from 'tiny-fsearch';

// predicates/resources
const predicate: string = 'search value';
const filePath: string = 'file-to-search';

/// Synchronous File-Searching
FSearch.Sync.query(predicate, { filePath });
FSearch.Sync.grep(predicate, { filePath });

/// Streamed File-Searching
FSearch.Stream.grep(predicate, { filePath });
```

### Search Options

```typescript
interface FSearch.Options {
    limit?: number;
    isRegExp?: boolean;
    ignoreCase?: boolean;
    matchWholeWord?: boolean;
}
```

### Match Results

```typescript
interface FSearch.Result {
    line: number;
    column: number;
    content: string;
}
```

## License

[MIT](https://opensource.org/licenses/MIT)
