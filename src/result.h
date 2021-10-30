#ifndef TINY_SEARCH_RESULT_H
#define TINY_SEARCH_RESULT_H

/// C++ STL
#include <string>
#include <vector>

/// Node Header
#include <napi.h>

/// Tiny Headers
#include "options.h"

namespace tiny {

    /// Key Search HIT Structure.
    struct SearchHit {
        std::string content = "";
        size_t line = 0;
        size_t column = 0;

        /// Converts a search hit into a NAPI object.
        Napi::Object toObject() const {
            Napi::Object obj = Napi::Object::New(SearchOptions::NAPI_ENV);

            obj.Set("content", content);
            obj.Set("line", line);
            obj.Set("column", column);

            return obj;
        }
    };

    /// Base Query Match results.
    struct QueryMatch {
        std::vector<SearchHit> hits = {};

        /**
         * Constructs a query match from given properties.
         * @param hits                      Search Hits.
         */
        QueryMatch(const std::vector<SearchHit>& hits = {}) : hits(hits) {}

        /// Converts a query match into a NAPI object.
        virtual Napi::Object toObject() const {
            Napi::Object obj = Napi::Object::New(SearchOptions::NAPI_ENV);
            Napi::Array arr = Napi::Array::New(SearchOptions::NAPI_ENV, hits.size());

            for (size_t ii = 0; ii < hits.size(); ii++) arr[ii] = hits[ii].toObject();
            obj.Set("hits", arr);

            return obj;
        }
    };

    /// Base Search Match results.
    struct SearchMatch : public QueryMatch {
        std::string filePath = "";

        /**
         * Constructs a search match from given properties.
         * @param filePath                  Search FilePath.
         * @param hits                      Search Hits.
         */
        SearchMatch(const std::string& filePath, const std::vector<SearchHit>& hits = {})
            : filePath(filePath), QueryMatch(hits) {}

        /// Converts a search match into a NAPI object.
        Napi::Object toObject() const override {
            Napi::Object obj = Napi::Object::New(SearchOptions::NAPI_ENV);
            Napi::Array arr = Napi::Array::New(SearchOptions::NAPI_ENV, hits.size());

            for (size_t ii = 0; ii < hits.size(); ii++) arr[ii] = hits[ii].toObject();
            obj.Set("hits", arr);
            obj.Set("filePath", filePath);

            return obj;
        }
    };

}  // namespace tiny

#endif