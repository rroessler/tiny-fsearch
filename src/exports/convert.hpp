#ifndef FSEARCH_CONVERSION_HPP
#define FSEARCH_CONVERSION_HPP

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
static Napi::Value match_to_value(Napi::Env env, const Match &match) {
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

} // namespace fsearch::exports

#endif
