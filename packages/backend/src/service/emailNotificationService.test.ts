import { describe, test } from "vitest"
import { makeEmailNotifierFromEnv } from "./emailNotificationService"

// SKip because this requires correct .env config.
describe.skip("emailNotifier", () => {
  test("send eman an email", async () => {
    const [error, notifier] = makeEmailNotifierFromEnv()
    if (error) {
      throw error
    }
    await notifier.sendEmail({
      to: "esherrthan@gmail.com",
      subject: "test",
      text: "testing email notifier",
      from: "ethu",
    })
  })
})
