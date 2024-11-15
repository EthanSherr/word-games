import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import { appRouter } from "./router";
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
