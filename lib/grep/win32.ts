/// FSearch Modules
import { Match } from '../match';
import { Abstract } from './abstract';

/** Windows Grep Shell Implementation. */
export class Win32 extends Abstract {
    //  PROPERTIES  //

    /** The base grep command. */
    readonly command: string = 'findstr';

    /** Ensure we are using "Command Prompt" shell. */
    protected readonly m_shell?: string = 'cmd.exe';

    //  PUBLIC METHODS  //

    /** Formats Win32 "findstr" arguments. */
    format() {
        // destructure some common flags
        const { ignoreCase, predicate } = this.query;

        // prepare the initial arguemtns
        const args: string[] = [];

        // push on the required details as necessary
        if (ignoreCase) args.push('/i');

        // ensure we also have base details
        args.push('/r', '/n', '/o', predicate, this.filePath);

        // and return the "findstr" arguments
        return args;
    }

    //  PRIVATE METHODS  //

    /**
     * Coordinates parsing "findstr" outputs in the format "line:content".
     * @param match                                 Match to parse.
     */
    protected m_parse(match: string): Pick<Match.IResult, 'line' | 'content'> {
        // pre-parse the grep output value
        const [line, content] = match.match(/^(\d+):(.*)/) ?? ['-1', match];

        // return the formatted result instance
        return { line: parseInt(line, 10), content };
    }
}
