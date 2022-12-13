/// Node Modules
import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';

/// Vendor Modules
import fg from 'fast-glob';
import requirable from 'bindings';

/** File-Search Namespace. */
export namespace FileSearch {
    /**************
     *  TYPEDEFS  *
     **************/

    /** Success Match. */
    export interface IResult {
        readonly text: string;
        readonly line: number;
        readonly column: number;
        readonly filePath: string;
    }

    /** Search options to use. */
    export interface IOptions {
        readonly exclude: string[]; // exclude globs
        readonly ignoreCase: boolean; // whether to ignore case
        readonly matchWholeWord: boolean; // whole word to use
    }

    /** Denotes the current file-search state. */
    export const enum State {
        PENDING,
        FULFILLED,
        CANCELLED,
    }

    /** Available file-search events. */
    export interface IEvents {
        match: [result: IResult];
        completed: [];
        cancelled: [];
    }

    /** Subscription Handler. */
    export type Subscribable = <K extends keyof IEvents>(eventName: K, callback: (...args: IEvents[K]) => void) => void;

    /****************
     *  PROPERTIES  *
     ****************/

    /** Default search options. */
    export const DEFAULT_OPTIONS = Object.freeze({
        exclude: [],
        ignoreCase: true,
        matchWholeWord: false,
    } as IOptions);

    /********************
     *  IMPLEMENTATION  *
     ********************/

    /** Query Implementation. */
    export class Query {
        /****************
         *  PROPERTIES  *
         ****************/

        /** Internalized search emitter. */
        private m_emitter = new EventEmitter();

        /** Internal cancellation token. */
        private m_state?: State;

        /** Binding reference. */
        private m_binding: any;

        /***********************
         *  GETTERS / SETTERS  *
         ***********************/

        /** Denotes if currently cancelled. */
        get cancelled() {
            return this.m_state === State.CANCELLED;
        }

        /** Gets the current query state. */
        get state() {
            return this.m_state ?? State.PENDING;
        }

        /** Getter for the  */
        get on(): Subscribable {
            return this.m_emitter.on.bind(this.m_emitter);
        }

        /******************
         *  CONSTRUCTORS  *
         ******************/

        /**
         * Constructs a file-search query.
         * @param root                          Root source to use.
         * @param predicate                     Search predicate.
         * @param options                       Options to use.
         */
        constructor(root: string, predicate: string | RegExp, options: Partial<IOptions> = {}) {
            // throw an error if the source does not exist
            if (!fs.existsSync(root)) throw new Error(`Query source "${root}" does not exist`);

            // resolve the default options to be used
            const params = Object.assign({}, DEFAULT_OPTIONS, options);

            // resolve the base predicate, source and emitter to be used
            predicate = this.m_resolvePredicate(predicate, params);
            const emitter = this.m_emitter.emit.bind(this.m_emitter);
            const sources = this.m_resolveSources(path.resolve(root), params);

            // require now to ensure not loaded until needed
            const { _Query_impl } = requirable('fsearch');

            // and create the internal binding instance
            this.m_binding = new _Query_impl(sources, predicate, emitter);
        }

        /********************
         *  PUBLIC METHODS  *
         ********************/

        /** Attempts running the desired query. */
        launch() {
            // do nothing if not ready to be launched
            if (typeof this.m_state !== 'undefined') return;

            // set into the pending state
            this.m_state = State.PENDING;

            // prepare the completion handler
            this.on('completed', this.m_dispose.bind(this, State.FULFILLED));

            // tell the binding the begin
            this.m_binding?.launch();
        }

        /** Cancels the query instance. */
        cancel() {
            // force disposal with the cancelled state
            this.m_dispose(State.CANCELLED);

            // denote as cancelled
            this.m_emitter.emit('cancelled');
        }

        /*********************
         *  PRIVATE METHODS  *
         *********************/

        /**
         * Handles internal disposal of the query.
         * @param state                 State to finally set.
         */
        private m_dispose(state?: State) {
            // set the state if possible
            if (typeof state !== 'undefined') this.m_state = state;

            // and dispose of the underlying query instance
            this.m_binding?.dispose();

            // and remove all event listeners
            this.m_emitter.removeAllListeners();
        }

        /**
         * Converts the predicate into a suitable regexp source string.
         * @param pred                  Predicate to use.
         * @param opts                  Options to alter regex with.
         */
        private m_resolvePredicate(pred: string | RegExp, { ignoreCase, matchWholeWord }: IOptions) {
            // determine the base source to be used from the given predicate
            let source = typeof pred === 'string' ? pred.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : pred.source;

            // update the source based on the options found
            if (ignoreCase) source = new RegExp(source, 'i').source;
            if (matchWholeWord) source = `\\b${source}\\b`;

            // return the resulting source string
            return source;
        }

        /**
         * Resolves all available sources to be used.
         * @param root                  Base source.
         * @param options               Options to resolve from.
         */
        private m_resolveSources(root: string, { exclude }: IOptions): string[] {
            return fs.statSync(root).isDirectory() ? fg.sync(`${root}/**`, { ignore: exclude }) : [root];
        }
    }

    /********************
     *  PUBLIC METHODS  *
     ********************/

    /**
     * Promisifies the completion handler.
     * @param source                            Source file/dir.
     * @param predicate                         Search predicate.
     * @param options                           Options to use.
     */
    export const promisify = async (source: string, predicate: string | RegExp, options: Partial<IOptions> = {}) => {
        // construct the base query to be used
        const query = new Query(source, predicate, options);

        // prepare the output results
        const results: IResult[] = [];

        // prepare the match handlers
        query.on('match', results.push.bind(results));

        // and attempt launching
        return new Promise<IResult[]>((resolve) => {
            // prepare the query completion handler
            query.on('completed', () => resolve(results));

            // handle cancellation requests
            query.on('cancelled', () => resolve([]));

            // and launch the query
            query.launch();
        });
    };
}
