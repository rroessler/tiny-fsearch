#ifndef FSEARCH_CONVERSION_HPP
#define FSEARCH_CONVERSION_HPP

/// C++ Includes
#include <deque>
#include <fstream>
#include <memory>
#include <sstream>

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
        object.Set("content", match.content);
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

/// Additional Conversion Details.
namespace fsearch::details {

    //  PUBLIC METHODS  //

    /**
     * @brief Resolves a source buffer based on the available buffer dictionary.
     * @param source                                    Source to resolve.
     * @param dict                                      Stream dictionary.
     */
    inline static std::shared_ptr<std::istream> resolve_buffer(const std::string &source, const Napi::Object &dict) {
        // construct a normal stream if the buffer exists
        if (dict.Has(source)) {
            // get the underlying NAPI buffer
            auto buffer = dict.Get(source).As<Napi::Int8Array>();
            auto pointer = buffer.Data();  // and the base pointer

            // construct the string-stream to wrap
            return std::make_shared<std::stringstream>(std::string(pointer, pointer + buffer.ByteLength()));
        }

        // otherwise memory map the file we want to search
        auto stream = std::ifstream(source);
        auto buffer = std::make_shared<std::stringstream>();

        // copy the buffer across
        (*buffer) << stream.rdbuf();

        // and return the underlying buffer to use
        return buffer;
    }

}  // namespace fsearch::details

#endif
