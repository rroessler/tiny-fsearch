#ifndef FSEARCH_CONVERSION_HPP
#define FSEARCH_CONVERSION_HPP

/// C++ Includes
#include <deque>
#include <regex>

/// Napi Includes
#include <napi.h>

/// File-Search Includes
#include "fsearch/match.hpp"

/// File-Search Details.
namespace fsearch::details {
    //  PUBLIC METHODS  //

    /// @brief Converts a native match to a JS object.
    /// @param env                                  Node environment.
    /// @param match                                Match instance.
    inline static Napi::Value match_to_value(Napi::Env env, const Match& match) {
        // prepare a base object instance
        auto object = Napi::Object::New(env);

        // set all the prescribed values
        object.Set("line", match.line);
        object.Set("column", match.column);
        object.Set("content", match.content);

        // return the resulting object
        return object;
    }

    /// @brief Converts multiple matches into a JS array.
    /// @param env                                  Node environment.
    /// @param match                                Matches to convert.
    inline static Napi::Value matches_to_array(Napi::Env env,
                                               const std::deque<Match>& matches) {
        // construct the output array instance
        auto output = Napi::Array::New(env, matches.size());

        // fill out the matches as necessary
        for (size_t ii = 0; ii < matches.size(); ++ii)
            output.Set(ii, match_to_value(env, matches.at(ii)));

        // return the resulting instance
        return output;
    }

    /// @brief Formats outgoing content values.
    /// @param env                                  Node environment.
    /// @param value                                Matched value instance.
    /// @param col                                  Column number of match.
    /// @param content                              Original content.
    /// @param callback                             JS formatter callback.
    inline static std::string format_content(Napi::Env env, const std::string& value, size_t col, const std::string& content, const Napi::FunctionReference& callback) {
        // check if our callback is available
        if (callback.IsEmpty()) return content;

        printf("Match: '%s'\n", value.c_str());
        printf("Content: '%s'\n", content.c_str());

        // determine the arguments we need for our formatter
        auto replacement = Napi::String::New(env, value);
        auto before = Napi::String::New(env, content.substr(0, col));
        auto after = Napi::String::New(env, content.substr(col + value.size()));

        // run the formatter callback necessar
        auto result = callback.Call({replacement, before, after});

        // convert the result into a suitable conversion
        return result.ToString().Utf8Value();
    }

}  // namespace fsearch::details

#endif
