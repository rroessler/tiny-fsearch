#ifndef FSEARCH_QUERY_HPP
#define FSEARCH_QUERY_HPP

/// C++ Includes
#include <regex>
#include <string>
#include <vector>

/// File-Search Namespace.
namespace fsearch {

//  TYPEDEFS  //

/// File sources typing.
using Sources = std::vector<std::string>;

//  IMPLEMENTATIONS  //

/// File-Search Query Instance.
class Query {

  //  PROPERTIES  //

  const Sources m_sources;  // Source files vector.
  const std::regex m_regex; // Regular expression to use.

public:
  //  CONSTRUCTORS  //

  /// Default Constructor.
  Query() = delete;

  /**
   * @brief Constructs a file-search query instance.
   * @param a_sources                       Sources to use.
   * @param a_regex                         Regular expression.
   */
  Query(const Sources &a_sources, const std::regex &a_regex)
      : m_sources(a_sources), m_regex(a_regex) {}
};

} // namespace fsearch

#endif
