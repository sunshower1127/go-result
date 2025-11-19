/**
 * Result type representing either success [value, null] or error [null, error]
 */
export type Result<S, E> = readonly [S, null] | readonly [null, E];

/**
 * Creates a success result
 * @param value - The success value
 * @returns A tuple [value, null]
 */
export const ok = <S>(value: S): readonly [S, null] => [value, null] as const;

/**
 * Creates an error result
 * @param error - The error value
 * @returns A tuple [null, error]
 */
export const err = <E>(error: E): readonly [null, E] => [null, error] as const;
