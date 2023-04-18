#ifndef FSEARCH_MATCH_HPP
#define FSEARCH_MATCH_HPP

/// C++ Includes
#include <cstdint>
#include <string>

/// File-Search Namespace.
namespace fsearch {
    //  TYPEDEFS  //

    /// Match Structure.
    struct Match {
        //  PROPERTIES  //

        size_t line;
        size_t column;
        std::string value;
        std::string content;
    };

}  // namespace fsearch

#endif
