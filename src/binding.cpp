/// Vendor Includes
#include <napi.h>

/// FSearch Exports
#include "exports/stream.hpp"
#include "exports/sync.hpp"

/// @brief Initializes all the "fsearch" bindings.
/// @param env                               Node environment.
/// @param exports                           Exports instance.
Napi::Object __init__(Napi::Env env, Napi::Object exports) {
    // expose the synchronous handler
    exports.Set("sync", Napi::Function::New(env, fsearch::exports::sync));

    // expose the stream generator
    exports.Set("stream", Napi::Function::New(env, fsearch::exports::stream));

    // return the mutated exports value
    return exports;
}

// expose the exports initializer
NODE_API_MODULE(addon, __init__)