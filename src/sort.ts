import immutable from "immutable"
import { compare } from "./compare"
import { compile } from "./compile"
import { SortBy, SortFunc, SortOperation, SortOperations } from "./types"

function isMap(maybeMap: any) {
  return !!(maybeMap && maybeMap["@@__IMMUTABLE_MAP__@@"])
}

function get(obj: any, key: string): any {
  if (isMap(obj)) {
    return (obj as immutable.Map<string, any>).get(key)
  }
  return obj[key]
}

function getField<T>(operation: SortOperation, entity: T) {
  return operation.fields.reduce((obj, field) => get(obj, field), entity) as T
}

function getSimilarity<T>(operation: SortOperation | SortFunc<T>, a: T, b: T) {
  switch (typeof operation) {
    case "function": {
      const sortFunc = operation as SortFunc<T>
      return sortFunc(a, b)
    }

    case "object": {
      const fieldA = getField(operation as SortOperation, a)
      const fieldB = getField(operation as SortOperation, b)

      return (operation as SortOperation).order < 0
        ? compare(fieldB, fieldA) // Negative values represent a descend sorting operation.
        : compare(fieldA, fieldB) // Positive values represent an ascend sorting operation.
    }

    default:
      throw new Error("Operation is required to be a function or an object")
  }
}

function stableSort<T>(
  a: T,
  b: T,
  operation: SortOperation | SortFunc<T>,
  nextOperations: SortOperations<T>
): number {
  if (!operation) return 0

  const similarity = getSimilarity(operation, a, b)

  if (similarity === 0 && nextOperations.length) {
    return stableSort(a, b, nextOperations[0], nextOperations.slice(1))
  }

  return similarity
}

export function sort<T>(array: T[], sortBy: SortBy<T>) {
  const elements = array || []
  const operations = compile(sortBy)

  return elements.sort((a, b) => {
    return stableSort(a, b, operations[0], operations.slice(1))
  })
}
