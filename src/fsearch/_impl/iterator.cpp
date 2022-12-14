/// File-Search Includes
#include "fsearch/iterator.hpp"
#include "fsearch/query.hpp"

//  CONSTRUCTORS  //

fsearch::Iterator::Iterator() : fsearch::Iterator(nullptr) {}

fsearch::Iterator::Iterator(fsearch::Query *query) : m_query(query) {
  // ensure we have a valid query instance to set
  if (query == nullptr || !query->sources.size()) {
    return;
  }

  // since a valid query, set the current file-stream
  m_ifs = std::ifstream(query->sources.at(m_curr));
  m_ifs.sync_with_stdio(false);

  // and increment the stream instance by one place
  m_findNextMatch();
}

fsearch::Iterator::Iterator(fsearch::Iterator &other)
    : m_query(other.m_query), m_curr(other.m_curr), m_ifs({}),
      m_line(other.m_line), m_column(other.m_column), m_target(other.m_target),
      m_match(other.m_match) {
  // if completed, then do nothing
  if (complete()) {
    return;
  }

  // ensure we have a valid stream instance
  m_ifs = std::ifstream(m_query->sources.at(m_curr));
  m_ifs.sync_with_stdio(false);
  m_ifs.seekg(other.m_ifs.tellg());
}

fsearch::Iterator &fsearch::Iterator::operator=(fsearch::Iterator other) {
  if (this == &other) {
    return *this;
  }

  // and copy across all the required items
  m_query = other.m_query;
  m_curr = other.m_curr;
  m_line = other.m_line;
  m_column = other.m_column;
  m_target = other.m_target;
  m_match = other.m_match;

  // ensure we have a valid stream instance
  m_ifs = std::ifstream(m_query->sources.at(m_curr));
  m_ifs.sync_with_stdio(false);
  m_ifs.seekg(other.m_ifs.tellg());

  // and return the base instance
  return *this;
}

//  PUBLIC METHODS  //

bool fsearch::Iterator::complete() const noexcept {
  return m_query == nullptr || m_curr >= m_query->sources.size();
}

//  PRIVATE METHODS  //

void fsearch::Iterator::m_updateStream() {
  ++m_curr; // increment the stream index

  // update the stream instance if possible
  if (!complete()) {
    m_ifs = std::ifstream(m_query->sources.at(m_curr));
    m_ifs.sync_with_stdio(false); // ensure fast as possible
    m_line = m_column = 0;        // reset the current line/column
  }
}

void fsearch::Iterator::m_findNextMatch() {
  // if we have reached the end of all available items
  if (complete()) {
    return (void)(m_query = nullptr);
  }

  // update the current stream if necessary
  if (m_ifs.eof()) {
    m_updateStream();         // update the current stream
    return m_findNextMatch(); // attempt matching again
  }

  // set a placeholder for the current line to get
  auto target = m_target;
  auto match = std::smatch();

  // if the target is empty, then attempt getting the next available line
  if (target.empty()) {
    // get the next available line to match
    std::getline(m_ifs, target);

    ++m_line;     // increment the line number
    m_column = 0; // and reset the column number
  }

  // attempt coordinating a match instance
  if (std::regex_search(target, match, m_query->regex)) {
    // get the non-resulting match
    auto column = match.position() + m_column;
    auto filePath = m_query->sources.at(m_curr);

    // determine some details about the match
    auto suffix = match.suffix();

    // increment to current column and determine length
    m_column += target.size() - suffix.length();
    auto length = m_column - column;

    // good match, so we can increment the current value
    m_match.emplace(Match{m_line, column + 1, length, filePath});

    // and update the current target
    m_target = suffix;
  } else {
    m_target = "";     // bad match, so empty the current line
    m_findNextMatch(); // and continue searching
  }
}
