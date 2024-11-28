import { frontendRoutes } from "@word-games/common"
import { DateTime } from "luxon"
import cron from "node-cron"
import { z } from "zod"
import { metaHotTeardown } from "./metaHotTeardown"
import { makeEmailNotifier } from "./service/emailNotificationService"
import { makeFileStorageService } from "./service/fileStorageService"
import { makePyramidService } from "./service/pyramidService"
import { makePyramidStoreService } from "./service/pyramidStoreService"
import { makeSqliteService } from "./service/sqliteService"
import { makeUserService } from "./service/userService"
import { makeWordStoreService } from "./service/wordStoreService"
import { publicProcedure, router } from "./trpc"

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

  const fileStorageAdapter = makeFileStorageService(pyramidStorageDIr)
  await fileStorageAdapter.init()

  const pyramidStore = makePyramidStoreService(fileStorageAdapter)
  const pyramidService = makePyramidService(wordStore, pyramidStore)

  const userService = makeUserService(makeSqliteService(sqliteDbPath))
  await userService.init()

  const secure = Boolean(VITE_EMAIL_NOTIFIER_SECURE)

  const emailService = makeEmailNotifier({
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
  // Schedule a daily 9am challenge!
  const task = cron.schedule("0 9 * * *", async () => {
    // This is probably not the right place for this...

    const seed = DateTime.now().toLocaleString()
    const [error] = await pyramidService.generate(seed)
    if (error) {
      console.error("error generatating word of day", error)
      return
    }

    const frontendUrl = import.meta.env.VITE_FRONTEND_URL

    const dailyPyramidUrl = new URL(
      frontendUrl,
      frontendRoutes.dailyPyramidGame.makeUrl(),
    ).toString()

    const users = await userService.getAllNotifiableUsers()
    for (const user of users) {
      const cancelNotificationUrl = new URL(
        frontendUrl,
        frontendRoutes.cancelNotification.makeUrl({
          queryParams: { email: user.email },
        }),
      ).toString()

      emailService.sendEmail({
        to: user.email,
        subject: "New Pyramid Challenge!",
        text:
          `We generated a new email challenge for you. Play it here: ${dailyPyramidUrl}. ` +
          `You can unsubscribe to these emails here: ${cancelNotificationUrl}`,
      })
    }
  })
  metaHotTeardown(() => task.stop())

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
