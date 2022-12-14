/// Napi Includes
#include <napi.h>

/// File-Search Includes
#include "exports/query.hpp"

//  IMPLEMENTATIONS  //

/** Gets the next available asynchronous match instance. */
class AsyncMatch : public Napi::AsyncWorker {
  //  PROPERTIES  //

  /// Underlying iterator instance.
  fsearch::Iterator &m_iterator;

public:
  // CONSTRUCTORS  //

  /**
   * @brief Constructs the worker with a given callback and iterator value.
   * @param callback                                Async callback.
   * @param iterator                                Query iterator.
   */
  AsyncMatch(Napi::Function &callback, fsearch::Iterator &iterator)
      : Napi::AsyncWorker(callback), m_iterator(iterator) {}

  /// Default destructor.
  ~AsyncMatch() {}

  //  PUBLIC METHODS  //

  /// No-operation execution.
  void Execute() {}

  /// Handles the completion result.
  void OnOK() {
    // determine what our iterator result is
    auto value = m_iterator != fsearch::Iterator()
                     ? fsearch::exports::match_to_value(Env(), *m_iterator)
                     : Env().Undefined();

    // run the desired callback instance
    Callback().Call({value});

    // and uppdate the iterator instance
    ++m_iterator;
  }
};

//  PUBLIC METHODS  //

Napi::Value
fsearch::exports::_Query_impl::next(const Napi::CallbackInfo &info) {
  Napi::Function callback = info[0].As<Napi::Function>();
  auto worker = new AsyncMatch(callback, m_iterator);
  worker->Queue();
  return info.Env().Undefined();
}
