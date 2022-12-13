#ifndef FSEARCH_QUERY_HPP
#define FSEARCH_QUERY_HPP

/// Napi Includes
#include <napi.h>

/// NAPI Exports Namespace.
namespace fsearch::exports {

//  IMPLEMENTATIONS  //

/// Wrapper for Query Instances.
class Query : public Napi::ObjectWrap<Query> {
  //  PROPERTIES  //

public:
  //  CONSTRUCTORS  //

  static Napi::Object __init__(Napi::Env env, Napi::Object exports) {
    // define the base query class
    Napi::Function func = DefineClass(env, "_Query_impl", {});

    // expose the constructor to be used
    Napi::FunctionReference *ctor = new Napi::FunctionReference();
    *ctor = Napi::Persistent(func);
    env.SetInstanceData<Napi::FunctionReference>(ctor);

    // attach it as an export
    exports.Set("_Query_impl", func);

    // and return the resulting exports
    return exports;
  }

  Query(const Napi::CallbackInfo &info) : Napi::ObjectWrap<Query>(info) {}
};

} // namespace fsearch::exports

#endif
