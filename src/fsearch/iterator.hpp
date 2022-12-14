#ifndef FSEARCH_ITERATOR_HPP
#define FSEARCH_ITERATOR_HPP

/// C++ Includes
#include <fstream>
#include <iterator>
#include <optional>
#include <type_traits>

/// File-Search Includes
#include "fsearch/match.hpp"

/// File-Search Namespace.
namespace fsearch {

//  FORWARD DECLARATIONS  //

/// File-Search Query Definition.
class Query;

//  IMPLEMENTATIONS  //

/// Query Iterator Class.
class Iterator {
  //  PROPERTIES  //

  Query *m_query;           // Query instance.
  size_t m_curr = 0;        // Current source index.
  std::ifstream m_ifs = {}; // File-stream instance.

  size_t m_line = 0;   // Current line number.
  size_t m_column = 0; // Current column number.

  std::string m_target = "";                   // Target line to search.
  std::optional<Match> m_match = std::nullopt; // Current match value.

public:
  //  TYPEDEFS  //

  using value_type = Match;               // Base value typing.
  using pointer = value_type *;           // Pointer typing.
  using reference = value_type &;         // Value reference typing.
  using difference_type = std::ptrdiff_t; // Difference typing.
  using iterator_category = std::forward_iterator_tag; // Type of iterator.

  //  CONSTRUCTORS  //

  /// Default Constructor.
  Iterator();

  /**
   * @brief Constructs an iterator with the desired query.
   * @param query                   Query instance.
   */
  explicit Iterator(Query *query);

  /**
   * @brief Explicitly defined copy-constructor.
   * @param other                   Other iterator instance.
   */
  Iterator(Iterator &other);

  //  PUBLIC METHODS  //

  /// Denotes if the iterator is at its end.
  bool complete() const noexcept;

  //  OPERATOR METHODS  //

  /**
   * @brief Copy-assignment operator.
   * @param other                   Other iterator instance.
   */
  Iterator &operator=(Iterator other);

  /// Gets the current match value.
  reference operator*() { return *m_match; }

  /// Pre-incement operator.
  Iterator &operator++() { return m_findNextMatch(), *this; }

  /// Post-increment operator.
  Iterator operator++(int) {
    auto self = *this;
    return m_findNextMatch(), self;
  }

  /**
   * @brief Checks if the iterator does not equal another.
   * @param other                   Other iterator.
   */
  bool operator!=(const Iterator &other) { return m_query != nullptr; }

private:
  //  PRIVATE METHODS  //

  /// Gets the next available match.
  void m_findNextMatch();

  /// Updates the current stream target.
  void m_updateStream();
};

} // namespace fsearch

#endif
