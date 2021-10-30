/// C++ STL
#include <fstream>
#include <iostream>
#include <memory>
#include <sstream>

/// Tiny Headers
#include "fquery.h"
#include "fsearch.h"
#include "options.h"

/**************************
 *  NAPI ENV DECLARATION  *
 **************************/

napi_env tiny::SearchOptions::NAPI_ENV = nullptr;
std::regex tiny::SearchOptions::m_specialChars = std::regex{R"([-[\]{}()*+?.,\^$|#\s])"};

/*************
 *  HELPERS  *
 *************/

/**
 * Coordinates searching from a stream of characters.
 * @param stream                    Streamable Source.
 * @param options                   Search Options.
 */
tiny::QueryMatch _coreSearcher_impl(std::istream& stream, const tiny::SearchOptions& options) {
    tiny::QueryMatch query = {};                 // set a placeholder query
    size_t line = options.zeroIndexing ? 0 : 1;  // line number statistics
    std::string content;                         // line content

    // begin iterating over the stream
    while (std::getline(stream, content)) {
        // attempt as many matches as possible
        std::vector<size_t> matches = options.evaluate(content);
        for (const auto& column : matches) query.hits.push_back({content, line, column});

        line++;  // increment the line number on every jump
    }

    // and return the query results
    return query;
}

/****************************
 *  FSEARCH IMPLEMENTATION  *
 ****************************/

std::vector<tiny::SearchMatch> tiny::_fsearch_impl(const Napi::Array& filePaths, const tiny::SearchOptions& options) {
    std::vector<tiny::SearchMatch> results = {};  // prepare a result output

    // iterate over all the available file paths.
    for (size_t ii = 0; ii < filePaths.Length(); ii++) {
        // generate an input file stream
        const std::string& filePath = filePaths.Get(ii).As<Napi::String>().Utf8Value();
        std::ifstream ifs(filePath);

        // if not open, then ignore this file
        if (!ifs.is_open()) continue;

        // get the next result
        tiny::QueryMatch query = _coreSearcher_impl(ifs, options);
        results.push_back({filePath, query.hits});

        // finally coordinate some clean up
        ifs.close();
    }

    // and return the results
    return results;
}

/***************************
 *  FQUERY IMPLEMENTATION  *
 ***************************/

tiny::QueryMatch tiny::_fquery_impl(const Napi::Buffer<uint8_t>& buffer, const tiny::SearchOptions& options) {
    uint8_t* data = buffer.Data();  // convert from buffered data into string
    const std::string source(data, data + buffer.Length());

    // create a string stream out of the input source
    std::istringstream stream(source);

    // and coordinate a query
    return _coreSearcher_impl(stream, options);
}
