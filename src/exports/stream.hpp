#ifndef FSEARCH_STREAM_HPP
#define FSEARCH_STREAM_HPP

/// C++ Includes
#include <deque>
#include <memory>

/// Napi Includes
#include <napi.h>

/// FSearch Includes
#include "fsearch/convert.hpp"
#include "fsearch/match.hpp"
#include "fsearch/query.hpp"

/// File-Search Exports Namespace.
namespace fsearch::exports {
    //  IMPLEMENTATIONS  //

    /// Generator for streamed value-matching.
    struct Stream : public Napi::ObjectWrap<Stream> {
        //  TYPEDEFS  //

        /// Stream-Worker for generating asynchronous search results.
        class Worker : public Napi::AsyncWorker {
            //  PROPERTIES  //

            size_t m_ln = 1;   // Line number.
            size_t m_col = 1;  // Column number.

            std::regex m_re;                   // RegExp to use.
            std::string m_content;             // Initial content value.
            std::deque<Match> m_matches = {};  // The current list of results.

           public:
            /// The promise we will be resolving with.
            Napi::Promise::Deferred deferred;

            //  CONSTRUCTORS  //

            Worker(Napi::Env& env, const size_t& line, const std::regex& re, const std::string& content)
                : Napi::AsyncWorker(env),
                  m_ln(line),
                  m_re(re),
                  m_content(content),
                  deferred(Napi::Promise::Deferred::New(env)) {}

            //  PUBLIC METHODS  //

            /// @brief Handles attempting to match search results.
            void Execute() {
                // prepare the content iterator to be used
                std::string current = m_content;

                // attempting searching for matches
                for (std::smatch sm; std::regex_search(current, sm, m_re);) {
                    // determine the current column value
                    m_col += sm.prefix().str().size();

                    // emplace the new match instance
                    m_matches.push_back({m_ln, m_col, m_content});

                    // update the iterative values to be used
                    m_col += sm.str().size();
                    current = sm.suffix().str();
                }
            }

            /// @brief Handles completion after execution.
            void OnOK() {
                deferred.Resolve(details::matches_to_array(Env(), m_matches));
            }

            /// @brief Handles error instances.
            /// @param error                        Error to pass onwards.
            void OnError(const Napi::Error& error) {
                deferred.Reject(error.Value());
            }
        };

       private:
        //  PROPERTIES  //

        double m_limit = 0;                        // Maximum search limit value.
        std::shared_ptr<Query> m_query = nullptr;  // The underlying query instance.

        size_t m_line = 1;  // Current line-number.
        double m_hits = 0;  // Total matches so far.

       public:
        //  CONSTRUCTORS  //

        /// @brief Constructs a streamed iterator for file-searching.
        /// @param info                             Callback information.
        Stream(const Napi::CallbackInfo& info) : Napi::ObjectWrap<Stream>(info) {
            auto env = info.Env();  // get the current NAPI environment

            // ensure we have a valid number of arguments
            if (info.Length() < 4) throw Napi::Error::New(env, "Invalid number of arguments");

            // deconstruct the valid number of arguments
            auto filePath = info[0].ToString().Utf8Value();
            auto predicate = info[1].ToString().Utf8Value();
            auto ignoreCase = info[2].ToBoolean().Value();
            m_limit = info[3].ToNumber().DoubleValue();

            // construct the underlying query instance
            m_query = std::make_shared<Query>(filePath, predicate, ignoreCase);
        }

        /// @brief Coordinates initializing streams for use in
        /// @param env
        /// @param exports
        /// @return
        static Napi::Object __init__(Napi::Env env, Napi::Object exports) {
            // define the underlying constructor for Node to use
            Napi::Function func = DefineClass(env, "StreamGenerator", {InstanceMethod(Napi::Symbol::WellKnown(env, "iterator"), &Stream::Iterator)});

            // extend the exports object with this class factory
            exports.Set("StreamGenerator", func);

            // and return the mutated exports
            return exports;
        }

        //  PUBLIC METHODS  //

        /// @brief The constructor for iterators generating from this object.
        /// @param info                             Callback information.
        Napi::Value Iterator(const Napi::CallbackInfo& info) {
            // get the current NAPI environment
            auto env = info.Env();

            // make an iterable object instance
            auto iterable = Napi::Object::New(env);

            // construct the next handler
            auto next = Napi::Function::New(env, [=](const Napi::CallbackInfo& info) {
                // get the current environment value
                auto env = info.Env();
                std::string content;

                // create the iterator result value
                auto value = Napi::Object::New(env);

                // read the next available line now
                auto incomplete = m_hits < m_limit && !m_query->stream.eof();

                // attempt getting the next line to work on
                if (incomplete) {
                    // get the next available line to be used
                    std::getline(m_query->stream, content);

                    // construct a worker that will self-destruct when done
                    auto worker = new Worker(env, m_line, m_query->re, content);

                    // queue the worker for asynchronous execution
                    worker->Queue();

                    // append the current promise onto the value
                    value.Set("value", worker->deferred.Promise());

                    // update the current line number now
                    ++m_line;
                }

                // set the current completion flag
                value.Set("done", !incomplete);

                // can return the iterator value now
                return value;
            });

            // ensure the handler is bound correctly
            iterable["next"] = next.Get("bind").As<Napi::Function>().Call(next, {iterable});

            // finally return the resulting iterator instance
            return iterable;
        }
    };

}  // namespace fsearch::exports

#endif
