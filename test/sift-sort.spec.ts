import { fromJS } from "immutable"
import { sort, inverse } from "../src/sift-sort"

const _ = undefined

interface School {
  name: string
  type: string
  population: number
  active: boolean
}

const schools = [
  {
    name: "University High School",
    type: "High School",
    population: 5000,
    active: true
  },
  { name: "UCI", type: "College", population: 100000, active: true },
  { name: "MIT", type: "College", population: 0, active: false }
]

describe("Undefined arguments", () => {
  it("returns an empty array with no arguments", () => {
    expect(sort(undefined, undefined)).toEqual([])
  })

  it("returns the input with no sortBy argument", () => {
    expect(sort(schools, undefined)).toEqual(schools)
    expect(sort(fromJS(schools), undefined)).toEqual(fromJS(schools))
  })

  it("returns an empty array with an empty input", () => {
    expect(sort(_, { name: 1 })).toEqual([])
  })
})

function trySort(type, data, expected, sortBy, sortByImmut = undefined) {
  describe(type, () => {
    it("sorts an object", () => {
      const result = sort(data, sortBy)
      expect(result).toEqual(expected)
    })

    it("sorts an ImmutableJS Map", () => {
      const result = sort(fromJS(data), sortByImmut || sortBy)
      expect(result).toEqual(fromJS(expected))
      expect(result.toJS()).toEqual(expected)
    })
  })
}

describe("Accend string sort", () => {
  let expected = [
    { name: "MIT", type: "College", population: 0, active: false },
    { name: "UCI", type: "College", population: 100000, active: true },
    {
      name: "University High School",
      type: "High School",
      population: 5000,
      active: true
    }
  ]

  trySort("regular", schools, expected, { name: 1 })
  trySort("inverse", schools, expected, inverse({ name: -1 }))
  trySort(
    "function",
    schools,
    expected,
    (a, b) => a.name.localeCompare(b.name), // regular sortBy
    (a, b) => a.get("name").localeCompare(b.get("name")) // immutable
  )
})

describe("Descend string sort", () => {
  let expected = [
    {
      name: "University High School",
      type: "High School",
      population: 5000,
      active: true
    },
    { name: "UCI", type: "College", population: 100000, active: true },
    { name: "MIT", type: "College", population: 0, active: false }
  ]

  trySort("regular", schools, expected, { name: -1 })
  trySort("inverse", schools, expected, inverse({ name: 1 }))
  trySort(
    "function",
    schools,
    expected,
    (a, b) => b.name.localeCompare(a.name), // regular sortBy
    (a, b) => b.get("name").localeCompare(a.get("name")) // immutable
  )
})

describe("Accend number sort", () => {
  let expected = [
    { name: "MIT", type: "College", population: 0, active: false },
    {
      name: "University High School",
      type: "High School",
      population: 5000,
      active: true
    },
    { name: "UCI", type: "College", population: 100000, active: true }
  ]

  trySort("regular", schools, expected, { population: 1 })
  trySort("inverse", schools, expected, inverse({ population: -1 }))
  trySort(
    "function",
    schools,
    expected,
    (a, b) => a.population - b.population, // regular sortBy
    (a, b) => a.get("population") - b.get("population") // immutable
  )
})

describe("Descend number sort", () => {
  let expected = [
    { name: "UCI", type: "College", population: 100000, active: true },
    {
      name: "University High School",
      type: "High School",
      population: 5000,
      active: true
    },
    { name: "MIT", type: "College", population: 0, active: false }
  ]

  trySort("regular", schools, expected, { population: -1 })
  trySort("inverse", schools, expected, inverse({ population: 1 }))
  trySort(
    "function",
    schools,
    expected,
    (a, b) => b.population - a.population, // regular sortBy
    (a, b) => b.get("population") - a.get("population") // immutable
  )
})

describe("Accend boolean sort", () => {
  let expected = [
    { name: "MIT", type: "College", population: 0, active: false },
    { name: "UCI", type: "College", population: 100000, active: true },
    {
      name: "University High School",
      type: "High School",
      population: 5000,
      active: true
    }
  ]

  trySort("regular", schools, expected, { active: 1 })
  trySort("inverse", schools, expected, inverse({ active: -1 }))
  trySort(
    "function",
    schools,
    expected,
    (a, b) => String(a.active).localeCompare(String(b.active)), // regular sortBy
    (a, b) => String(a.get("active")).localeCompare(String(b.get("active"))) // immutable
  )
})

describe("Descend boolean sort", () => {
  let expected = [
    { name: "UCI", type: "College", population: 100000, active: true },
    {
      name: "University High School",
      type: "High School",
      population: 5000,
      active: true
    },
    { name: "MIT", type: "College", population: 0, active: false }
  ]

  trySort("regular", schools, expected, { active: -1 })
  trySort("inverse", schools, expected, inverse({ active: 1 }))
  trySort(
    "function",
    schools,
    expected,
    (a, b) => String(b.active).localeCompare(String(a.active)), // regular sortBy
    (a, b) => String(b.get("active")).localeCompare(String(a.get("active"))) // immutable
  )
})

describe("Multiple sorting operations", () => {
  let expected = [
    { name: "UCI", type: "College", population: 100000, active: true },
    { name: "MIT", type: "College", population: 0, active: false },
    {
      name: "University High School",
      type: "High School",
      population: 5000,
      active: true
    }
  ]

  trySort("regular", schools, expected, { type: 1, population: -2 })
  trySort("inverse", schools, expected, inverse({ type: -1, population: 2 }))
})

const accounts = [
  { meta: { lastLogin: { day: 2 }, id: 8 }, type: "user" },
  { meta: { lastLogin: { day: 4 }, id: 7 }, type: "user" },
  { meta: { lastLogin: { day: 6 }, id: 1 }, type: "admin" }
]

describe("Single nested sort", () => {
  let expected = [
    { meta: { lastLogin: { day: 6 }, id: 1 }, type: "admin" },
    { meta: { lastLogin: { day: 4 }, id: 7 }, type: "user" },
    { meta: { lastLogin: { day: 2 }, id: 8 }, type: "user" }
  ]

  trySort("regular", accounts, expected, { meta: { id: 1 } })
  trySort("inverse", accounts, expected, inverse({ meta: { id: -1 } }))
})

describe("Multiple nested sorts", () => {
  let expected = [
    { meta: { lastLogin: { day: 4 }, id: 7 }, type: "user" },
    { meta: { lastLogin: { day: 2 }, id: 8 }, type: "user" },
    { meta: { lastLogin: { day: 6 }, id: 1 }, type: "admin" }
  ]

  trySort("regular", accounts, expected, { meta: { id: 2 }, type: -1 })
  trySort("inverse", accounts, expected, inverse({ meta: { id: -2 }, type: 1 }))
})
