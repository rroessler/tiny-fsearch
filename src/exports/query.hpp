#ifndef FSEARCH_EXPORTS_QUERY_HPP
#define FSEARCH_EXPORTS_QUERY_HPP

/// C++ Includes
#include <iostream>
#include <memory>

/// Napi Includes
#include <napi.h>

/// File-Search Includes
#include "exports/convert.hpp"
#include "fsearch/query.hpp"

/// NAPI Exports Namespace.
namespace fsearch::exports {

//  IMPLEMENTATIONS  //

/// Wrapper for Query Instances.
class _Query_impl : public Napi::ObjectWrap<_Query_impl> {
  //  PROPERTIES  //

  Sources m_sources = {};  // Sources instance.
  std::regex m_regex = {}; // Base search regex.

  /// Node environment instance.
  Napi::Env m_env;

  /// Initialy query iterator.
  Iterator m_iterator;

  /// File-Search query instance.
  std::shared_ptr<Query> m_query = nullptr;

public:
  //  CONSTRUCTORS  //

  /**
   * @brief Napi initializer.
   * @param env                     Node environment.
   * @param exports                 Exports object.
   */
  static Napi::Object __init__(Napi::Env env, Napi::Object exports) {
    // define the base query class
    Napi::Function func =
        DefineClass(env, "_Query_impl",
                    {InstanceMethod("sync", &_Query_impl::sync),
                     InstanceMethod("next", &_Query_impl::next)});

    // expose the constructor to be used
    Napi::FunctionReference *ctor = new Napi::FunctionReference();
    *ctor = Napi::Persistent(func);
    env.SetInstanceData<Napi::FunctionReference>(ctor);

    // attach it as an export
    exports.Set("_Query_impl", func);

    // and return the resulting exports
    return exports;
  }

  /**
   * @brief Constructs a new instance of a query wrapper.
   * @param info                    Function information.
   */
  _Query_impl(const Napi::CallbackInfo &info)
      : Napi::ObjectWrap<_Query_impl>(info), m_env(info.Env()) {
    // ensure we have a valid number of arguments
    if (info.Length() != 2) {
      auto msg = "_Query_impl > Expected two arguments";
      throw Napi::Error::New(m_env, msg);
    }

    // begin reading the sources, regex and emitter instance
    auto sources = info[0].As<Napi::Array>();
    m_sources.reserve(sources.Length());

    // push back all the available sources
    for (size_t ii = 0; ii < sources.Length(); ++ii) {
      m_sources.push_back(sources.Get(ii).ToString());
    }

    // construct the regex instance from the string given
    m_regex = std::regex(info[1].ToString().Utf8Value(),
                         std::regex_constants::ECMAScript);

    // reconstruct the base query
    m_query = std::make_shared<Query>(m_sources, m_regex);

    // and iterator instance
    m_iterator = m_query->begin();
  }

  //  PUBLIC METHODS  //

  /** Launches the file-search. */
  Napi::Value sync(const Napi::CallbackInfo &info) {
    // prepare the output vector to use
    std::vector<Match> results = {};
    auto env = info.Env();

    // attempt iterating over all available matches
    while (m_iterator != m_query->end()) {
      results.push_back(*m_iterator), ++m_iterator;
    }

    // construct the output array instance
    auto output = Napi::Array::New(env, results.size());

    // begin filling the array out
    for (size_t ii = 0; ii < results.size(); ++ii) {
      output.Set(ii, match_to_value(env, results.at(ii)));
    }

    // return an empty result
    return output;
  }

  /** Attempts getting the next asynchronous value. */
  Napi::Value next(const Napi::CallbackInfo &info);
};

} // namespace fsearch::exports

#endif
