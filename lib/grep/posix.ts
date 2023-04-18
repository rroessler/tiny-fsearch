/// FSearch Modules
import { Match } from '../match';
import { Abstract } from './abstract';

/** POSIX Compliant Grep Handling. */
export class POSIX extends Abstract {
    //  PROPERTIES  //

    /** The base grep command. */
    readonly command: string = 'grep';

    /** No need to specify a POSIX shell. */
    protected readonly m_shell?: string = undefined;

    //  PUBLIC METHODS  //

    /** Formats POSIX compliant "grep" arguments. */
    format() {
        // destructure some common flags
        const { isRegExp, ignoreCase, matchWholeWord, limit, source } = this.query;

        // prepare the initial arguments
        const args: string[] = isRegExp ? ['-E'] : ['-F'];

        // push on the required details as necessary
        if (ignoreCase) args.push('-i');
        if (matchWholeWord) args.push('-w');
        if (Number.isFinite(limit) && limit >= 0) args.push(`-m ${limit}`);

        // ensure we also have the base details
        args.push('-n', '-e', source, this.filePath, '||', ':;');

        // and return the grep arguments
        return args;
    }
}
