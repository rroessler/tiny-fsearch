// Node Headers
#include <napi.h>

// Tiny Headers
#include "fquery.h"
#include "fsearch.h"

/**
 * "fsearch" delegation method for Napi.
 * @param info                  Function callback information.
 */
Napi::Array _fsearch_delegation(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    Napi::Array filePaths = info[0].As<Napi::Array>();
    tiny::SearchOptions opts(info[1].ToObject(), env);

    // coordinate a search
    std::vector<tiny::SearchMatch> matches = tiny::_fsearch_impl(filePaths, opts);

    // generate an output
    Napi::Array results = Napi::Array::New(env, matches.size());
    for (size_t ii = 0; ii < matches.size(); ii++) results[ii] = matches[ii].toObject();
    return results;
}

/**
 * "fquery" delegation method for Napi.
 * @param info                  Function callback information.
 */
Napi::Object _fquery_delegation(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    Napi::Buffer<uint8_t> buffer = info[0].As<Napi::Buffer<uint8_t>>();
    tiny::SearchOptions opts(info[1].ToObject(), env);

    // coordinate a query
    tiny::QueryMatch match = tiny::_fquery_impl(buffer, opts);
    return match.toObject();  // generate an output
}

/**
 * Initialisation method for native node module.
 * @param env                           Node Environment.
 * @param exports                       Eventual exports.
 */

Napi::Object initialise(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "_fsearch_impl"), Napi::Function::New(env, _fsearch_delegation));
    exports.Set(Napi::String::New(env, "_fquery_impl"), Napi::Function::New(env, _fquery_delegation));

    // fulfill return for NAPI
    return exports;
}

/// Prepare the available module
NODE_API_MODULE(tfsearch, initialise);