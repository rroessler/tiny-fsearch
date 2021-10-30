#ifndef TINY_FSEARCH_H
#define TINY_FSEARCH_H

/// Node Headers
#include <napi.h>

/// Tiny Headers
#include "options.h"
#include "result.h"

namespace tiny {

    /**
     * Core method for conducting file searches across multiple files.
     * @param filePaths                 File Paths to search.
     * @param options                   Search Options.
     */
    std::vector<SearchMatch> _fsearch_impl(
        const Napi::Array& filePaths, const SearchOptions& options);

}  // namespace tiny

#endif