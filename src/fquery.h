#ifndef TINY_FQUERY_H
#define TINY_FQUERY_H

/// C++ STL
#include <iostream>

/// Node Headers
#include <napi.h>

/// Tiny Headers
#include "options.h"
#include "result.h"

namespace tiny {

    /**
     * Core method for searching within a given string source.
     * @param buffer                    Source to search.
     * @param options                   Search Options.
     */
    QueryMatch _fquery_impl(const Napi::Buffer<uint8_t>& buffer, const SearchOptions& options);

}  // namespace tiny

#endif