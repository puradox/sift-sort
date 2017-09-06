import { SortBy, SortObject } from "./types"

export function inverse<T>(sortBy: SortObject) {
  const result: SortBy<T> = {}

  for (const key of Object.keys(sortBy)) {
    const value = sortBy[key]

    switch (typeof value) {
      case "number":
        result[key] = (value as number) * -1
        break
      case "object":
        if (value && !Array.isArray(value)) {
          result[key] = inverse(value as SortObject)
        }
        break
      default:
        break
    }
  }

  return result
}
