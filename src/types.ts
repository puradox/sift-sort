/**
 * An object specifying sorting operations. Keys represent the field to
 * sort with and the value can either be an object or an integer.
 *
 * An integer value specifies the order in which to perform sorting
 * operations.
 *
 * An object value specifies a nested object in which to recurse into.
 * Used for objects that requrie "deep sorting" (objects within
 * objects).
 *
 * ```
 * {
 *   student: {
 *     lastName: 1,
 *     firstName: -3,
 *   },
 *   order: 2,
 *   account: {
 *    email: -4,
 *   },
 * }
 * ```
 */
export interface SortObject {
  [key: string]: number | SortObject
}

export interface SortOperation {
  fields: string[]
  order: number
}

export type SortFunc<T> = (a: T, b: T) => number

export type SortOperations<T> = Array<SortOperation | SortFunc<T>>

export type SortBy<T> = SortObject | string | SortFunc<T> | SortOperations<T>
