#ifndef FSEARCH_QUERY_HPP
#define FSEARCH_QUERY_HPP

/// C++ Includes
#include <deque>
#include <fstream>
#include <regex>
#include <vector>

/// File-Search Includes
#include "fsearch/match.hpp"

/// File-Search Namespace.
namespace fsearch {

    //  TYPEDEFS  //

    /// File sources typing.
    using Sources = std::vector<std::string>;

    //  IMPLEMENTATIONS  //

    /// File-Search Query Instance.
    struct Query {
        //  PROPERTIES  //

        /// Source file to search.
        const std::string source;

        //  CONSTRUCTORS  //

        /// Default Constructor.
        Query() = delete;

        /**
         * @brief Constructs a file-search query instance.
         * @param a_source                      Sources file.
         */
        Query(const std::string &a_source)
            : source(a_source) {}

        //  PUBLIC METHODS  //

        /**
         * Coordinates searching across the current query source.
         * @param re                            Regex instance.
         */
        std::deque<Match> find(const std::regex &re) const {
            // construct the file-stream to be used
            auto stream = std::fstream(source);
            auto matches = std::deque<Match>();

            // use a base string instance (save creating new instances)
            std::string line;

            // iteratively read all the lines in the file
            for (size_t ln = 1, col = 1; std::getline(stream, line); ++ln, col = 1) {
                // attempt searching line-by line
                for (std::smatch sm; std::regex_search(line, sm, re);) {
                    size_t len = sm.str().size();           // the length of the match found
                    col += sm.prefix().str().size() + len;  // get the current column

                    // and emplace the matches when found
                    matches.push_back({ln, col - len, len, source});

                    // update the iteration condition
                    line = sm.suffix();
                }
            }

            // return the resulting matches found
            return matches;
        }
    };

}  // namespace fsearch

#endif
