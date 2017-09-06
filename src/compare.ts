export function compare(a: any, b: any): number {
  if (typeof a === "number" && typeof b === "number") {
    return a - b
  }
  return String(a).localeCompare(b)
}
