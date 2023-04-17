/// Node Modules
import fs from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';

/** Temporary File Functionality. */
export namespace Temporary {
    //  TYPEDEFS  //

    /** Temporary File Operations Handler. */
    export type Handler = (filePath: string) => any;

    //  PROPERTIES  //

    /** The base temporary directory path. */
    export const DIR_PATH = fs.realpathSync(os.tmpdir());

    //  PUBLIC METHODS  //

    /**
     * Generates a randomized file-name.
     * @param prefix                        Optional prefix.
     */
    export const createFileName = (prefix: string = '') => path.join(DIR_PATH, prefix + crypto.randomUUID());
}
