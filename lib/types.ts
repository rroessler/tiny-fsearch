/** Match Result Interface. */
export interface IQueryMatch {
    readonly line: number;
    readonly column: number;
    readonly length: number;
    readonly filePath: string;
}
