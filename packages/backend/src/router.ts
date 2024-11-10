import { publicProcedure, router } from "./trpc";
import { PyramidPrompt } from "@word-games/common/src/model/pyramid";
import { z } from "zod";

export const appRouter = router({
  userList: publicProcedure.query(async () => {
    // Retrieve users from a datasource, this is an imaginary database
    const users = [{ name: "etha2n" }];

    // const users: User[];
    return users;
  }),
  userById: publicProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts;
    console.log("input is", input);

    const user = { name: "etha2n" };

    return user;
  }),
  getPyramidGameToday: publicProcedure.query(async () => {
    const response: PyramidPrompt = {
      layers: [[{ character: "x", editable: false }]],
    };
    return response;
  }),
});

export type AppRouter = typeof appRouter;
