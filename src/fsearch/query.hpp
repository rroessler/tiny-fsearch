#ifndef FSEARCH_QUERY_HPP
#define FSEARCH_QUERY_HPP

/// C++ Includes
#include <deque>
#include <istream>
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
    class Query {
        //  PROPERTIES  //

        /// The underlying stream buffer.
        std::shared_ptr<std::istream> m_stream;

       public:
        /// Source file to search.
        const std::string source;

        //  CONSTRUCTORS  //

        /// Default Constructor.
        Query() = delete;

        /**
         * @brief Constructs a file-search query instance.
         * @param a_source                      Sources file.
         * @param a_stream                      Buffer instance.
         */
        Query(const std::string &a_source, const std::shared_ptr<std::istream> &a_stream)
            : m_stream(a_stream), source(a_source) {
            m_stream->sync_with_stdio(false), m_stream->tie(0);  // allow unrestricted mode
        }

        //  PUBLIC METHODS  //

        /**
         * Coordinates searching across the current query source.
         * @param re                            Regex instance.
         * @param leftovers                     Leftovers allowed.
         */
        std::deque<Match> find(const std::regex &re, const uint32_t &leftovers) const {
            // always pre-clear the status of the stream
            m_stream->clear(), m_stream->seekg(0);

            // prepare the output matches we will attempt
            auto matches = std::deque<Match>();

            // use a base string instance (save creating new instances)
            std::string line;

            // iteratively read all the lines in the file
            for (size_t ln = 1, col = 1; std::getline((*m_stream.get()), line); ++ln, col = 1) {
                // stop if we have exceeded the maximum allowed matches
                if (matches.size() >= leftovers) break;

                // attempt searching line-by line
                for (std::smatch sm; std::regex_search(line, sm, re);) {
                    size_t len = sm.str().size();           // the length of the match found
                    col += sm.prefix().str().size() + len;  // get the current column

                    // and emplace the matches when found
                    matches.push_back({ln, col - len, len, line, source});

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
