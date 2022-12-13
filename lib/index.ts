/// Node Modules
import fs from 'fs';
import { EventEmitter } from 'events';

/// Vendor Modules
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
        readonly exclude?: string[]; // exclude globs
        readonly ignoreCase?: boolean; // whether to ignore case
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
         * @param source                        Source to use.
         * @param predicate                     Search predicate.
         * @param options                       Options to use.
         */
        constructor(source: string, predicate: string | RegExp, options: IOptions = {}) {
            // throw an error if the source does not exist
            if (!fs.existsSync(source)) throw new Error(`Query source "${source}" does not exist`);

            // resolve the base predicate to be used
            predicate = this.m_resolve(predicate);

            // rebuild the options to be used
            const params = Object.assign({}, options, { emit: this.m_emitter.emit.bind(this.m_emitter) });

            // and construct the underlying binding instance
            const { _Query_impl } = requirable('fsearch');
            this.m_binding = new _Query_impl(predicate, params);
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
         * @param predicate                 Predicate to use.
         */
        private m_resolve(predicate: string | RegExp) {
            return typeof predicate === 'string' ? predicate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : predicate.source;
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
    export const promisify = async (source: string, predicate: string | RegExp, options: IOptions = {}) => {
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
