import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import { makeAppRouter } from "./router";
import express from "express";

const main = () => {
  const app = express();

  app.use(
    cors({
      origin: true, // allows all origins
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allows all common HTTP methods
      credentials: true, // allows cookies and credentials
    }),
  );

  // make the trpc appRouter - it handles all the requests
  const appRouter = makeAppRouter();

  app.use(
    "/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext: () => ({}),
    }),
  );

  const port = 4000;

  const server = app.listen(port, () => {
    console.log("server listening to port", port);
  });

  // This is fixes an issue with EACCESS PORT ALREADY IN USE during
  // development with node-vite.  TLDR: node-vite is hot reloading the "main.ts" module,
  // and it does all this within the same node process (unlike other reload tools!).
  // so between saves, there is already a server listening to port 4000!  These events help us
  // teardown the side effect that main() has.
  // https://github.com/vitest-dev/vitest/issues/2334
  if (import.meta.hot) {
    import.meta.hot.on("vite:beforeFullReload", () => {
      server.close();
    });
    import.meta.hot.dispose(() => {
      server.close();
    });
  }
};

main();
