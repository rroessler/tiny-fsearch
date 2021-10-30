#ifndef TINY_SEARCH_OPTIONS_H
#define TINY_SEARCH_OPTIONS_H

/// C++ STL
#include <regex>
#include <string>
using namespace std::string_literals;

/// Node Headers
#include <napi.h>

namespace tiny {

    /// Core Search Options Structure.
    class SearchOptions {
       public:
        /****************
         *  PROPERTIES  *
         ****************/

        std::string input = "";       /// Input Search String.
        bool isRegex = false;         /// Denotes if string is valid regex.
        bool matchCase = false;       /// Coordinates matching cases.
        bool matchWholeWord = false;  /// Coordinates matching whole words.
        bool zeroIndexing = false;    /// Denotes using zero indexing.

        /// Globally accessible NAPI environment.
        static napi_env NAPI_ENV;

        /********************
         *  PUBLIC METHODS  *
         ********************/

        /**
         * Constructs search options from a given Napi Object.
         * @param opts                  Given options.
         */
        SearchOptions(const Napi::Object &opts, const Napi::Env &env) {
            input = opts.Get("input").As<Napi::String>().Utf8Value();
            isRegex = opts.Get("isRegex").ToBoolean();
            matchCase = opts.Get("matchCase").ToBoolean();
            matchWholeWord = opts.Get("matchWholeWord").ToBoolean();
            zeroIndexing = opts.Get("zeroIndexing").ToBoolean();

            NAPI_ENV = env;  // save the core environement item

            // prepare the required REGEX for searching
            m_RE = m_prepareRegex();
        }

        /**
         * Coordinates a set of regex matches. Returns a list of columns in which matches occured.
         * @param source                Source string to match.
         */
        std::vector<size_t> evaluate(std::string source) const {
            std::vector<size_t> results = {};  // matches column value
            std::smatch sm;                    // set a placeholder for the matches
            size_t offset = 0;                 // offset for column results

            // iterate whilst there are matches
            while (std::regex_search(source, sm, m_RE)) {
                results.push_back(sm.position() + offset + (zeroIndexing ? 0 : 1));
                offset += source.size() - sm.suffix().length();
                source = sm.suffix();
            }

            // and return the results
            return results;
        }

       private:
        /// Core regex item.
        std::regex m_RE;

        /// Special REGEX characters.
        static std::regex m_specialChars;

        /*********************
         *  PRIVATE METHODS  *
         *********************/

        /// Prepares the core regex required for searching.
        std::regex m_prepareRegex() {
            std::regex_constants::syntax_option_type flags = std::regex::ECMAScript | (matchCase ? (std::regex_constants::syntax_option_type)0 : std::regex::icase);
            std::string base = isRegex ? input : m_sanitize(input);
            if (matchWholeWord) base = "\\b" + base + "\\b";
            return std::regex(base, flags);
        }

        /**
         * Sanitizes a user given string of all REGEX special characters.
         * @param str                   String to sanitize.
         */
        std::string m_sanitize(std::string str) {
            return std::regex_replace(str, m_specialChars, R"(\$&)");
        }
    };

}  // namespace tiny

#endif