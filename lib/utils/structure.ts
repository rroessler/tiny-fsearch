/** Object Functionality. */
export namespace Struct {
    //  PUBLIC METHODS  //

    /**
     * Coordinates picking out properties from an object.
     * @param value                                         Object value.
     * @param keys                                          Keys to pick.
     */
    export const pick = <T extends Record<any, any>, K extends keyof T>(value: T, ...keys: K[]): Pick<T, K> =>
        keys.filter((k) => k in value).reduce<Pick<T, K>>((a, k) => ((a[k] = value[k]), a), {} as any);
}
