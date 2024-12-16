import { createExpressMiddleware } from "@trpc/server/adapters/express"
import cors from "cors"
import express from "express"
import { metaHotTeardown } from "./metaHotTeardown"
import { makeAppRouter } from "./router"

const main = async () => {
  const app = express()

  app.use(
    cors({
      origin: true, // allows all origins
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allows all common HTTP methods
      credentials: true, // allows cookies and credentials
    }),
  )

  // make the trpc appRouter - it handles all the requests
  const appRouter = await makeAppRouter()

  app.use(
    "/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext: () => ({}),
    }),
  )

  const port = 4000

  const server = app.listen(port, () => {
    console.log("server listening to port", port)
  })

  metaHotTeardown(import.meta.hot, () => server.close())
}

main()
