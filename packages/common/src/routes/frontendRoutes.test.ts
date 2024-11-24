import { describe, expect, test } from "vitest"
import { makeUrlFactory } from "./makeUrlFactory"
import { frontendRoutes } from "./frontendRoutes"

describe("routes", () => {
  test("correct url", () => {
    const url = frontendRoutes.cancelNotification.makeUrl({
      queryParams: { email: "ethu@gmail.com" },
    })
    expect(url).toEqual("/cancel-notifications?email=ethu%40gmail.com")
  })

  test("fancy thing", () => {
    const userPage = makeUrlFactory<{ page: number }>()("/user/:id")
    const url = userPage.makeUrl({
      queryParams: { page: 5 },
      routeParams: { id: "3" },
    })
    expect(url).toEqual("/user/3?page=5")
  })

  test("what", () => {
    const result = new URLSearchParams({ hello: "foo", bad: "5" }).toString()
    console.log(result)
  })
})
