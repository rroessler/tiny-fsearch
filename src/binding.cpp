/// Vendor Includes
#include <napi.h>

/// File-Search Includes
#include "fsearch/query.hpp"

/**
 * @brief Initialises the module context.
 * @param env                               Node environment.
 * @param exports                           Current exports object.
 */
Napi::Object __init__(Napi::Env env, Napi::Object exports) {
  return fsearch::exports::Query::__init__(env, exports);
}

/// and expose the exports initializer
NODE_API_MODULE(addon, __init__)