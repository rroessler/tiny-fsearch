#ifndef FSEARCH_STREAM_HPP
#define FSEARCH_STREAM_HPP

/// C++ Includes
#include <algorithm>
#include <deque>

/// Napi Includes
#include <napi.h>

/// FSearch Includes
#include "fsearch/convert.hpp"
#include "fsearch/match.hpp"
#include "fsearch/query.hpp"

/// File-Search Exports Namespace.
namespace fsearch::exports {
    //  IMPLEMENTATIONS  //

    /// Stream-Worker for generating asynchronous search results.
    class Worker : public Napi::AsyncWorker {
        //  PROPERTIES  //

        double m_limit;  // Maximum search limit.
        Query m_query;   // Search query instance.

        /// The current list of results.
        std::deque<Match> m_matches = {};

       public:
        /// The promise we will be resolving with.
        Napi::Promise::Deferred deferred;

        //  CONSTRUCTORS  //

        /// @brief Constructs an asynchronous worker for streamed searches.
        /// @param env                                      Node environment.
        /// @param filePath                                 File to search in.
        /// @param predicate                                Search predicate.
        /// @param ignoreCase                               Case sensitivity.
        /// @param limit                                    Matches limit.
        Worker(Napi::Env& env, const std::string& filePath, const std::string& predicate, const bool& ignoreCase, const double& limit)
            : Napi::AsyncWorker(env),
              m_limit(limit),
              m_query(filePath, predicate, ignoreCase),
              deferred(Napi::Promise::Deferred::New(env)) {
        }

        //  PUBLIC METHODS  //

        /// @brief Handles attempting to match search results.
        void Execute() {
            // prepare the content iterator to be used
            std::string current = "";

            // iteratively read through all the available lines
            for (size_t ln = 1, col = 1; std::getline(m_query.stream, current); ++ln, col = 1) {
                // stop if we have reached our limit
                if (m_matches.size() > m_limit) break;

                // pre-cache the current line content
                const std::string content = current;

                // attempting searching for matches
                for (std::smatch sm; std::regex_search(current, sm, m_query.re);) {
                    // determine the current column value
                    col += sm.prefix().str().size();

                    // and update the available matches
                    m_matches.push_back({ln, col, sm.str(), content});

                    // update the iterative values to be used
                    col += sm.str().size();
                    current = sm.suffix().str();
                }
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

    //  PUBLIC METHODS  //

    inline static Napi::Value stream(const Napi::CallbackInfo& info) {
        // get the current NAPI environment
        auto env = info.Env();

        // ensure we have a valid number of arguments
        if (info.Length() < 4) throw Napi::Error::New(env, "Invalid number of arguments");

        // deconstruct the valid number of arguments
        auto filePath = info[0].ToString().Utf8Value();
        auto predicate = info[1].ToString().Utf8Value();
        auto ignoreCase = info[2].ToBoolean().Value();
        auto limit = info[3].ToNumber().DoubleValue();

        // construct a worker that will self-destruct when done
        auto worker = new Worker(env, filePath, predicate, ignoreCase, limit);

        // queue the worker for asynchronous execution
        worker->Queue();

        // return the underlying promise instance
        return worker->deferred.Promise();
    }

}  // namespace fsearch::exports

#endif
