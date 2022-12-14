#ifndef FSEARCH_QUERY_HPP
#define FSEARCH_QUERY_HPP

/// C++ Includes
#include <regex>
#include <vector>

/// File-Search Includes
#include "fsearch/iterator.hpp"

/// File-Search Namespace.
namespace fsearch {

//  TYPEDEFS  //

/// File sources typing.
using Sources = std::vector<std::string>;

//  IMPLEMENTATIONS  //

/// File-Search Query Instance.
class Query {
  //  TYPEDEFS  //

  /// Base iterator instance.
  using _Iter = Iterator;

public:
  //  PROPERTIES  //

  const Sources sources;  // Source files vector.
  const std::regex regex; // Regular expression to use.

  //  CONSTRUCTORS  //

  /// Default Constructor.
  Query() = delete;

  /**
   * @brief Constructs a file-search query instance.
   * @param a_sources                       Sources to use.
   * @param a_regex                         Regular expression.
   */
  Query(const Sources &a_sources, const std::regex &a_regex)
      : sources(a_sources), regex(a_regex) {}

  //  PUBLIC METHODS  //

  /// Gets the starting query value.
  _Iter begin() { return _Iter(this); }

  /// Gets the end query iterator.
  _Iter end() { return _Iter(nullptr); }
};

} // namespace fsearch

#endif
