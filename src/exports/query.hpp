#ifndef FSEARCH_EXPORTS_QUERY_HPP
#define FSEARCH_EXPORTS_QUERY_HPP

/// C++ Includes
#include <functional>
// #include <future>
#include <memory>
#include <mutex>
#include <thread>

/// Napi Includes
#include <napi.h>

/// File-Search Includes
#include "exports/convert.hpp"
#include "fsearch/query.hpp"

/// NAPI Exports Namespace.
namespace fsearch::exports {

    //  IMPLEMENTATIONS  //

    /** Asynchronous File-Search Generator. */
    class Generator : public Napi::ObjectWrap<Generator> {
        //  TYPEDEFS  //

        /// Deferred Promise Alias.
        using Future = std::unique_ptr<Napi::Promise::Deferred>;

        /// Generater Data-Type.
        struct Data {
            bool complete;
            Future deferred;
            std::deque<Match> matches;
        };

        /**
         * @brief Typed thread-safe callable function.
         * @param env                                   Napi environment.
         * @param callback                              JS callback function.
         * @param context                               Generator context.
         * @param data                                  Current iterator data.
         */
        static void m_callee(Napi::Env env, Napi::Function callback, Generator *context, Data *data) {
            // ensure we actually have a valid environment to be used
            if (env != nullptr) {
                // construct the current object iterator
                auto iter = Napi::Object::New(env);

                // set the appropriate values as necessary
                iter["done"] = Napi::Boolean::New(env, data->complete);

                // if not currently complete, then add the value to be used
                if (!data->complete) iter["value"] = matches_to_value(env, data->matches);

                // resolve the current iterator value
                data->deferred->Resolve(iter);
            }

            // also remove the data if necessary
            if (data != nullptr) delete data;
        }

        /// Typed Thread-Safe Function Alias.
        using TSFN = Napi::TypedThreadSafeFunction<Generator, Data, Generator::m_callee>;

        /// Napi finalizer data typing.
        using FinalizerDataType = void;

        //  PROPERTIES  //

        size_t m_position = 0;    // Position iterator.
        Sources m_sources = {};   // Sources instance.
        std::regex m_regex = {};  // Base search regex.

        std::mutex m_mutex;            // Worker mutex.
        std::condition_variable m_cv;  // Thread helper.

        std::thread m_thread;  // Current thread being used.
        Future m_deferred;     // Deferred future.
        TSFN m_tsfn;           // Thread-safe function.

        // /// Current futures to be requested.
        // std::deque<std::shared_future<void>> m_futures = {};

       public:
        //  CONSTRUCTORS  //

        /**
         * @brief Constructs a generator instance.
         * @param info                                  Callback information.
         */
        Generator(const Napi::CallbackInfo &info) : Napi::ObjectWrap<Generator>(info) {
            // ensure we have a valid number of arguments
            if (info.Length() != 2) throw Napi::Error::New(info.Env(), "Generator > Expected two arguments");

            // begin reading the sources, regex and emitter instance
            auto sources = info[0].As<Napi::Array>();
            m_sources.reserve(sources.Length());

            // push back all the available sources
            for (size_t ii = 0; ii < sources.Length(); ++ii) m_sources.push_back(sources.Get(ii).ToString());

            // construct the regex instance from the string given
            m_regex = std::regex(info[1].ToString().Utf8Value(), std::regex_constants::ECMAScript);
        }

        /**
         * @brief NAPI initializer required for module loading.
         * @param env                                   NAPI environment.
         * @param exports                               Module exports.
         */
        static Napi::Object Init(Napi::Env env, Napi::Object exports) {
            // construct the actual iterator function to be wrapped as a class factory
            Napi::Function iterator = DefineClass(env, "Generator", {InstanceMethod(Napi::Symbol::WellKnown(env, "asyncIterator"), &Generator::Iterator)});

            // expose onto the available exports
            exports.Set("Generator", iterator);

            // and return the exports to fulfil conditions
            return exports;
        }

        /**
         * @brief Ensures the generator context is cleaned up.
         * @param env                                   NAPI environment.
         * @param context                               Generator context.
         */
        static void FinalizerCallback(Napi::Env env, void *, Generator *context) {
            // join the thread back together
            context->m_thread.join();

            // and unreference the generator context
            context->Unref();
        }

        //  PUBLIC METHODS  //

        /**
         * @brief Constructs the current iterator instance.
         * @param info                                  Callback information.
         */
        Napi::Value Iterator(const Napi::CallbackInfo &info) {
            // prepare the napi environment
            auto env = info.Env();

            // do not allow concurrent threads to be used
            if (m_thread.joinable()) throw Napi::Error::New(env, "Concurrent iterations not implemented");

            // construct the thread-safe function to be used
            m_tsfn = TSFN::New(env, "tsfn", 0, 1, this, std::function<decltype(FinalizerCallback)>(FinalizerCallback));

            // prevent premature garbage collection
            Ref();

            // create the futures to be used asynchronously
            m_thread = std::thread(&Generator::m_threadEntry, this);

            // create the iterable instance
            auto iterable = Napi::Object::New(env);

            // set the "next" handler for the iterable
            iterable["next"] = Napi::Function::New(env, [this](const Napi::CallbackInfo &info) -> Napi::Value {
                std::lock_guard<std::mutex> lock(m_mutex);
                auto env = info.Env();  // get the underlying environment

                // ensure we do not have concurrent iterations
                if (m_deferred) throw Napi::Error::New(env, "Concurrent iterations not implemented");

                // construct the promise we will be using
                m_deferred = std::make_unique<Napi::Promise::Deferred>(env);

                // alert about the construction
                m_cv.notify_all();

                // and return the promise instance
                return m_deferred->Promise();
            });

            // return the iterable to be used
            return iterable;
        }

       private:
        //  PRIVATE METHODS  //

        /** Current thread entry method. */
        void m_threadEntry() {
            // continue matching results as necessary
            while (true) {
                std::unique_lock<std::mutex> lock(m_mutex);
                m_cv.wait(lock, [this] { return m_deferred != nullptr; });

                // if complete, then block with the final details
                if (m_position >= (m_sources.size() - 1)) {
                    m_tsfn.BlockingCall(new Data{true, std::move(m_deferred), {}});
                    break;
                }

                // get the next source to be used
                auto source = m_sources.at(m_position);

                // generate the current matches desired
                auto matches = Query(source).find(m_regex);

                // only block when matches were found
                if (matches.size()) m_tsfn.BlockingCall(new Data{false, std::move(m_deferred), matches});

                // increment the position now
                ++m_position;
            }

            // once complete, manually release the thread-safe function
            m_tsfn.Release();
        }
    };

    //  PUBLIC METHODS  //

    /** Launches the file-search. */
    inline static Napi::Value synchronous(const Napi::CallbackInfo &info) {
        // get the current NAPI environment
        auto env = info.Env();

        // ensure we have a valid number of arguments
        if (info.Length() != 2) throw Napi::Error::New(env, "Expected two arguments");

        // deconstruct the available sources to be used
        auto sources = info[0].As<Napi::Array>();

        // construct the regex instance from the string given
        auto regex = std::regex(info[1].ToString().Utf8Value(), std::regex_constants::ECMAScript);

        // prepare the output vector to use
        std::deque<Match> results = {};

        // iteratively query every single file instance
        for (size_t ii = 0; ii < sources.Length(); ++ii) {
            auto source = sources.Get(ii).ToString();
            auto matches = Query(source).find(regex);
            results.insert(results.end(), matches.begin(), matches.end());
        }

        // and construct the output array instance
        return matches_to_value(env, results);
    }

}  // namespace fsearch::exports

#endif
