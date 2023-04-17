/// Node Modules
import fs from 'fs';

/// FSearch Modules
import { Temporary } from './utils/temporary';
import { IDisposable } from './utils/disposable';

/** Source-File Wrapper. */
export class Source implements IDisposable {
    //  PROPERTIES  //

    /** The temporary flag. */
    private m_temporary: boolean;

    /** The base file-path of the source. */
    readonly filePath: string;

    //  CONSTRUCTORS  //

    /**
     * Constructs a new instance of a source value.
     * @param origin                            Source origin.
     */
    constructor(origin: Source.IFilePath | Source.IBuffer) {
        // determine if we have a buffer or file-path given
        const temporary = 'buffer' in origin;

        // assign the underlying temporary flag
        this.m_temporary = temporary;

        // assign the file-path as necessary
        this.filePath = temporary ? Temporary.createFileName() : origin.filePath;

        // again if temporary, assign the buffer instance
        if (temporary) fs.writeFileSync(this.filePath, origin.buffer);
    }

    /** Removes any temporary files. */
    dispose() {
        if (this.m_temporary) fs.rmSync(this.filePath);
    }
}

export namespace Source {
    //  TYPEDEFS  //

    /** File-Path Source Input. */
    export interface IFilePath {
        filePath: string;
    }

    /** Buffered Source Input. */
    export interface IBuffer {
        buffer: string | Buffer;
    }
}
