#ifndef FSEARCH_QUERY_HPP
#define FSEARCH_QUERY_HPP

/// C++ Includes
#include <deque>
#include <fstream>
#include <regex>
#include <string>

/// File-Search Namespace.
namespace fsearch {
    //  IMPLEMENTATIONS  //

    /// File-Search Query Instance.
    struct Query {
        //  PROPERTIES  //

        std::regex re;        // Predicate RegExp instance.
        std::fstream stream;  // Underlying file-stream to use.

        //  CONSTRUCTORS  //

        /// Remove the underlying query constructor.
        Query() = delete;

        /// @brief Constructs a file-query instance.
        /// @param a_filePath                         File to search.
        /// @param a_predicate                        Search predicate.
        /// @param a_ignoreCase                       Case-sensitivity flag.
        /// @param a_limit                            Maximum limit of results.
        Query(const std::string& a_filePath, const std::string& a_predicate,
              const bool& a_ignoreCase)
            : stream(a_filePath) {
            // preload the stream to ignore STDIO
            stream.sync_with_stdio(false), stream.tie(0);

            // construct the regexp flags necessary
            auto flags = std::regex_constants::ECMAScript;
            if (a_ignoreCase) flags |= std::regex_constants::icase;

            // and ensure that our regex value is set
            re = std::regex(a_predicate, flags);
        }
    };

}  // namespace fsearch

#endif
