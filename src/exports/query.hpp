#ifndef FSEARCH_EXPORTS_QUERY_HPP
#define FSEARCH_EXPORTS_QUERY_HPP

/// C++ Includes
#include <memory>

/// Napi Includes
#include <napi.h>

/// File-Search Includes
#include "fsearch/query.hpp"

/// NAPI Exports Namespace.
namespace fsearch::exports {

//  IMPLEMENTATIONS  //

/// Wrapper for Query Instances.
class _Query_impl : public Napi::ObjectWrap<_Query_impl> {
  //  PROPERTIES  //

  Sources m_sources = {};  // Sources instance.
  std::regex m_regex = {}; // Base search regex.

  /// Internalized callback emitter.
  Napi::Function m_emitter;

  /// Node environment instance.
  Napi::Env m_env;

  /// File-Search Query Iterator.
  std::unique_ptr<Query> m_iterator = nullptr;

public:
  //  CONSTRUCTORS  //

  /**
   * @brief Napi initializer.
   * @param env                     Node environment.
   * @param exports                 Exports object.
   */
  static Napi::Object __init__(Napi::Env env, Napi::Object exports) {
    // define the base query class
    Napi::Function func = DefineClass(
        env, "_Query_impl", {InstanceMethod("launch", &_Query_impl::launch)});

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
    if (info.Length() != 3) {
      auto msg = "_Query_impl > Expected three arguments";
      throw Napi::Error::New(m_env, msg);
    }

    // begin reading the sources, regex and emitter instance
    auto sources = info[0].As<Napi::Array>();
    m_sources.reserve(sources.Length());

    // push back all the available sources
    for (size_t ii = 0; ii < sources.Length(); ++ii) {
      m_sources.push_back(sources.Get(ii).ToString());
    }

    // construct the regex instance
    m_regex = std::regex(info[1].ToString().Utf8Value(),
                         std::regex_constants::ECMAScript);

    // get a reference to the function instance
    m_emitter = info[2].As<Napi::Function>();

    // reconstruct the base iterator
    m_iterator = std::make_unique<Query>(m_sources, m_regex);
  }

  //  PUBLIC METHODS  //

  /** Launches the file-search. */
  Napi::Value launch(const Napi::CallbackInfo &info) {
    return info.Env().Undefined();
  }
};

} // namespace fsearch::exports

#endif
