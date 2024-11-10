import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import { makePyramidService } from "./service/PyramidService";

export const makeAppRouter = () => {
  const pyramidService = makePyramidService();

  return router({
    // example trpc, get user list endpoint
    userList: publicProcedure.query(async () => {
      // Retrieve users from a datasource, this is an imaginary database
      const users = [{ name: "ethan" }];
      return users;
    }),
    // example trpc, get user by id with zod type checking on input
    userById: publicProcedure.input(z.string()).query(async (opts) => {
      const { input } = opts; // ts knows that input type is string because zod validation!

      const user = { name: "ethan" };
      return user;
    }),
    getPyramidOfTheDay: publicProcedure.query(
      pyramidService.getPyramidOfTheDay,
    ),
  });
};

// Type inferred AppRouter is used by the frontend - so that we can define
// methods above and have auto-complete endpoints in the frontend.
export type AppRouter = ReturnType<typeof makeAppRouter>;
