import { frontendRoutes } from "@word-games/common"
import { DateTime } from "luxon"
import cron from "node-cron"
import { z } from "zod"
import { makeEmailNotifierAdapter } from "./adapter/emailNotificationAdapter"
import { makePyramidStoreAdapter } from "./adapter/pyramidStoreAdapter"
import { makeUserStoreAdapter } from "./adapter/userStoreAdapter"
import { env } from "./env"
import { metaHotTeardown } from "./metaHotTeardown"
import { makePyramidService } from "./service/pyramidService"
import { makeUserService } from "./service/userService"
import { makeWordStoreService } from "./service/wordStoreService"
import { publicProcedure, router } from "./trpc"
import { makeFileStorageHelper } from "./utils/fileStorageHelper"
import { makeSqliteConnection } from "./utils/sqliteConnection"

const envSchema = z.object({
  VITE_PATH_TO_PYRMID_STORAGE: z.string(),
  VITE_PATH_TO_WORDS: z.string(),
  VITE_PATH_TO_USER_SQLITE_DB: z.string(),

  VITE_EMAIL_NOTIFIER_SECURE: z.boolean().default(false),
  // e.g., "smtp.gmail.com" for Gmail
  VITE_EMAIL_NOTIFIER_HOST: z.string(),
  VITE_EMAIL_NOTIFIER_EMAIL: z.string(),
  VITE_EMAIL_NOTIFIER_PASSWORD: z.string(),
})

// I think this should be moved eventually
// This is the only app layer I got right now
const bootstrap = async () => {
  const {
    VITE_PATH_TO_PYRMID_STORAGE: pyramidStorageDIr,
    VITE_PATH_TO_WORDS: wordStorageDir,
    VITE_PATH_TO_USER_SQLITE_DB: sqliteDbPath,
    VITE_EMAIL_NOTIFIER_EMAIL,
    VITE_EMAIL_NOTIFIER_HOST,
    VITE_EMAIL_NOTIFIER_PASSWORD,
    VITE_EMAIL_NOTIFIER_SECURE,
  } = envSchema.parse(import.meta.env)

  // Configure it?
  const wordStore = makeWordStoreService()

  const fileStorageAdapter = makeFileStorageHelper(pyramidStorageDIr)
  await fileStorageAdapter.init()

  const pyramidStore = makePyramidStoreAdapter(fileStorageAdapter)
  const pyramidService = makePyramidService(wordStore, pyramidStore)

  const sqliteConnection = makeSqliteConnection(sqliteDbPath)
  const userStore = makeUserStoreAdapter(sqliteConnection)
  await userStore.init()
  const userService = makeUserService(userStore)

  const secure = Boolean(VITE_EMAIL_NOTIFIER_SECURE)

  const emailService = makeEmailNotifierAdapter({
    host: VITE_EMAIL_NOTIFIER_HOST,
    pass: VITE_EMAIL_NOTIFIER_PASSWORD,
    secure,
    user: VITE_EMAIL_NOTIFIER_EMAIL,
  })

  const generate = () => {
    const seed = DateTime.now().toLocaleString()
    return pyramidService.generate(seed)
  }

  // Generate one now!
  generate()

  console.log("the time is", DateTime.now().toISO())
  const schedule = "0 9 * * *"
  // const schedule = "*/5 * * * *"
  console.log("scheduling cron", schedule)
  // Schedule a daily 9am challenge!
  const task = cron.schedule(
    schedule,
    async () => {
      try {
        // This is probably not the right place for this...
        console.log("running job cron job")
        const seed = DateTime.now().setZone("America/New_York").toLocaleString()
        const [error] = await pyramidService.generate(seed)
        if (error) {
          console.error("error generatating word of day", error)
          return
        }

        const frontendUrl = env.VITE_FRONTEND_URL

        const dailyPyramidUrl = new URL(
          frontendRoutes.dailyPyramidGame.makeUrl(),
          frontendUrl,
        ).toString()

        const users = await userService.getAllNotifiableUsers()
        console.log("notify", users)
        for (const user of users) {
          const cancelNotificationUrl = new URL(
            frontendUrl,
            frontendRoutes.cancelNotification.makeUrl({
              queryParams: { email: user.email },
            }),
          ).toString()

          await emailService.sendEmail({
            to: user.email,
            subject: "New Pyramid Challenge!",
            text:
              `We generated a new email challenge for you. Play it here: ${dailyPyramidUrl}. ` +
              `You can unsubscribe to these emails here: ${cancelNotificationUrl}`,
          })
          console.log("2")
        }
      } catch (e) {
        console.error("Error occured generating daily", e)
      }
    },
    {
      timezone: "America/New_York",
    },
  )
  metaHotTeardown(() => {
    console.log("stopping task")
    task.stop()
  })

  return { pyramidService, userService, emailService }
}

export const makeAppRouter = async () => {
  const { pyramidService, userService } = await bootstrap()
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
