#ifndef FSEARCH_SYNC_HPP
#define FSEARCH_SYNC_HPP

/// C++ Includes
#include <deque>

/// Napi Includes
#include <napi.h>

/// FSearch Includes
#include "fsearch/convert.hpp"
#include "fsearch/match.hpp"
#include "fsearch/query.hpp"

/// File-Search Exports Namespace.
namespace fsearch::exports {
    //  PUBLIC METHODS  //

    /// @brief Coordinates synchronous value-matching.
    /// @param info                             Function callback information.
    inline static Napi::Value sync(const Napi::CallbackInfo& info) {
        // get the current NAPI environment
        auto env = info.Env();

        // ensure we have a valid number of arguments
        if (info.Length() < 5) throw Napi::Error::New(env, "Invalid number of arguments");

        // deconstruct the valid number of arguments
        auto filePath = info[0].ToString().Utf8Value();
        auto predicate = info[1].ToString().Utf8Value();
        auto ignoreCase = info[2].ToBoolean().Value();
        auto limit = info[3].ToNumber().DoubleValue();

        // the formatter can be any value
        auto formatter = info[4].IsFunction() ? Napi::Persistent(info[4].As<Napi::Function>()) : Napi::FunctionReference();

        // construct the query instance
        auto query = Query(filePath, predicate, ignoreCase);

        // run a synchronous query instance
        auto matches = std::deque<Match>();

        // prepare the iteration values
        std::string current = "";

        // iteratively read through all the available lines
        for (size_t ln = 1, col = 1; std::getline(query.stream, current); ++ln, col = 1) {
            // stop if we have reached our limit
            if (matches.size() > limit) break;

            // pre-cache the current line content
            const std::string content = current;

            // attempt searching within the line itself
            for (std::smatch sm; std::regex_search(current, sm, query.re);) {
                // determine the current column value
                col += sm.prefix().str().size();

                // attempt formatting our value as necessary
                std::string formatted = details::format_content(env, sm.str(), col - 1, current, formatter);

                // emplace the new match instance
                matches.push_back({ln, col, formatted});

                // update iterative values
                current = sm.suffix().str();
                col += sm.str().size();
            }
        }

        // once complete, return the resulting matches
        return details::matches_to_array(env, matches);
    }

}  // namespace fsearch::exports

#endif
