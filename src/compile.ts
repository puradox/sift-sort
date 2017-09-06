import {
  SortBy,
  SortObject,
  SortOperation,
  SortOperations,
  SortFunc
} from "./types"

function toOperations(
  sortBy: SortObject,
  prevFields: string[] = []
): SortOperation[] {
  const result = []

  // Fill the result with sort operations
  for (const key of Object.keys(sortBy)) {
    const value = sortBy[key]
    const fields = [...prevFields, key]

    if (typeof value === "object") {
      result.push(...toOperations(value, fields))
    } else {
      result.push({
        fields,
        order: value
      })
    }
  }

  // Sort based on order
  result.sort((a, b) => Math.abs(a.order) - Math.abs(b.order))

  return result
}

/**
 * Convert an input into an array of sort operations.
 */
export function compile<T>(sortBy: SortBy<T>): SortOperations<T> {
  switch (typeof sortBy) {
    case "object":
      if (Array.isArray(sortBy)) {
        return sortBy
      }
      return toOperations(sortBy as SortObject)
    case "string":
      return toOperations({ [sortBy as string]: 1 })
    case "function":
      return [sortBy as SortFunc<T>]
    default:
      return []
  }
}
