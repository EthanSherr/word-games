import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import cron from "node-cron";
import { makePyramidRequestService } from "./service/pyramidRequestService";
import { makePyramidGeneratorService } from "./service/pyramidGeneratorService";
import { DateTime } from "luxon";
import { metaHotTeardown } from "./metaHotTeardown";

export const makeAppRouter = async () => {
  const pyramidService = makePyramidRequestService();
  const pyramidGeneratorService = makePyramidGeneratorService();
  await pyramidGeneratorService.init();

  const generate = () => {
    const seed = DateTime.now().toLocaleString();
    pyramidGeneratorService.generate(seed);
  };

  // Generate one now!
  generate();
  // Schedule a daily 9am challenge!
  const task = cron.schedule("0 9 * * *", generate);
  metaHotTeardown(() => task.stop());

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
    submitAnswer: publicProcedure
      // TODO validate the PyramidPrompt - make it a proper zod object
      .input(z.any())
      .mutation(async (opts) => {
        const { input } = opts;
        return await pyramidService.isValidPyramidSolution(input);
      }),
  });
};

// Type inferred AppRouter is used by the frontend - so that we can define
// methods above and have auto-complete endpoints in the frontend.
export type AppRouter = Awaited<ReturnType<typeof makeAppRouter>>;
