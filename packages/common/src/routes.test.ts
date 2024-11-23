import { describe, expect, test } from "vitest"
import { makeCancelNotificationUrl } from "./routes"

describe("routes", () => {
  test("correct url", () => {
    const url = makeCancelNotificationUrl({ email: "ethu@gmail.com" })
    expect(url).toEqual("/cancel-notifications?email=ethu%40gmail.com")
  })
})
