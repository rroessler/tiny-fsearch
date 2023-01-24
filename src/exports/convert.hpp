#ifndef FSEARCH_CONVERSION_HPP
#define FSEARCH_CONVERSION_HPP

/// C++ Includes
#include <deque>

/// Napi Includes
#include <napi.h>

/// File-Search Includes
#include "fsearch/match.hpp"

/// NAPI Exports Namespace.
namespace fsearch::exports {

    //  PUBLIC METHODS  //

    /**
     * @brief Converts a match instance to a JS value.
     * @param env                                   Napi environment.
     * @param match                                 Match to convert.
     */
    inline static Napi::Value match_to_value(Napi::Env env, const Match &match) {
        // construct the base object instance
        auto object = Napi::Object::New(env);

        // set all the prescibed values
        object.Set("line", match.line);
        object.Set("column", match.column);
        object.Set("length", match.length);
        object.Set("filePath", match.filePath);

        // and return the resulting object
        return object;
    }

    /**
     * @brief Converts a list of matches into a JS array value.
     * @param env                                   Napi environment.
     * @param matches                               Matches to convert.
     */
    inline static Napi::Value matches_to_value(Napi::Env env, const std::deque<Match> &matches) {
        // construct the output array instance
        auto output = Napi::Array::New(env, matches.size());

        // begin filling the array out
        for (size_t ii = 0; ii < matches.size(); ++ii) output.Set(ii, match_to_value(env, matches.at(ii)));

        // return an empty result
        return output;
    }

}  // namespace fsearch::exports

#endif
