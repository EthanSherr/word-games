import { publicProcedure, router } from "./trpc"
import { z } from "zod"
import cron from "node-cron"
import { makePyramidService } from "./service/pyramidService"
import { DateTime } from "luxon"
import { metaHotTeardown } from "./metaHotTeardown"
import { makeUserService } from "./service/userService"
import { makeEmailNotifierFromEnv } from "./service/emailNotificationService"

export const makeAppRouter = async () => {
  const pyramidService = makePyramidService()
  await pyramidService.init()

  const userService = makeUserService()
  await userService.init()

  const [error, emailService] = makeEmailNotifierFromEnv()
  if (error) {
    throw error
  }

  const generate = () => {
    const seed = DateTime.now().toLocaleString()
    return pyramidService.generate(seed)
  }

  // Generate one now!
  generate()
  // Schedule a daily 9am challenge!
  const task = cron.schedule("0 9 * * *", async () => {
    // This is probably not the right place for this...

    const seed = DateTime.now().toLocaleString()
    const [error] = await pyramidService.generate(seed)
    if (error) {
      console.error("error generatating word of day", error)
      return
    }
    const users = await userService.getAllNotifiableUsers()
    for (const user of users) {
      emailService.sendEmail({
        to: user.email,
        subject: "New Pyramid Challenge!",
        text: `We generated a new email challenge for you. Play it here: ${import.meta.env.VITE_FRONTEND_URL}`,
        html: `<div>hello</div>`,
      })
    }
  })
  metaHotTeardown(() => task.stop())

  return router({
    getPyramidOfTheDay: publicProcedure.query(async () => {
      const [err, result] = await pyramidService.getPyramidOfTheDay()

      if (err) {
        throw err
      }

      return result
    }),
    submitAnswer: publicProcedure
      // TODO validate the PyramidPrompt - make it a proper zod object
      .input(z.any())
      .mutation(async (opts) => {
        const { input } = opts
        const [err, result] = await pyramidService.isValidPyramidSolution(input)

        if (err) {
          throw err
        }

        return result
      }),
    notifyUserDaily: publicProcedure
      .input(z.object({ email: z.string().email(), notify: z.boolean() }))
      .mutation(async (opts) => {
        const {
          input: { email, notify },
        } = opts

        await userService.setReceiveDailyNotification(email, notify)
      }),
  })
}

// Type inferred AppRouter is used by the frontend - so that we can define
// methods above and have auto-complete endpoints in the frontend.
export type AppRouter = Awaited<ReturnType<typeof makeAppRouter>>
