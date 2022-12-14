#ifndef FSEARCH_MATCH_HPP
#define FSEARCH_MATCH_HPP

/// C++ Includes
#include <cstdint>
#include <string>

/// File-Search Namespace.
namespace fsearch {

//  TYPEDEFS  //

/// Match Typing.
struct Match {

  //  PROPERTIES  //

  size_t line = 0;
  size_t column = 0;
  size_t length = 0;
  std::string filePath = "";
};

} // namespace fsearch

#endif
