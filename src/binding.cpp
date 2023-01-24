/// Vendor Includes
#include <napi.h>

/// File-Search Includes
#include "exports/query.hpp"

/**
 * @brief Initialises the module context.
 * @param env                               Node environment.
 * @param exports                           Current exports object.
 */
Napi::Object __init__(Napi::Env env, Napi::Object exports) {
    // prepend all the required values for this addon
    exports.Set("synchronous", Napi::Function::New(env, fsearch::exports::synchronous));

    // add on the required generator instance
    return fsearch::exports::Generator::Init(env, exports);
}

/// and expose the exports initializer
NODE_API_MODULE(addon, __init__)