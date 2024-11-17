import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import cron from "node-cron";
import { makePyramidService } from "./service/pyramidService";
import { DateTime } from "luxon";
import { metaHotTeardown } from "./metaHotTeardown";

export const makeAppRouter = async () => {
  const pyramidService = makePyramidService();
  await pyramidService.init();

  const generate = () => {
    const seed = DateTime.now().toLocaleString();
    pyramidService.generate(seed);
  };

  // Generate one now!
  generate();
  // Schedule a daily 9am challenge!
  const task = cron.schedule("0 9 * * *", () => {
    const seed = DateTime.now().toLocaleString();
    pyramidService.generate(seed);
  });
  metaHotTeardown(() => task.stop());

  return router({
    getPyramidOfTheDay: publicProcedure.query(async () => {
      const [err, result] = await pyramidService.getPyramidOfTheDay();

      if (err) {
        throw err;
      }

      return result;
    }),
    submitAnswer: publicProcedure
      // TODO validate the PyramidPrompt - make it a proper zod object
      .input(z.any())
      .mutation(async (opts) => {
        const { input } = opts;
        const [err, result] =
          await pyramidService.isValidPyramidSolution(input);

        if (err) {
          throw err;
        }

        return result;
      }),
  });
};

// Type inferred AppRouter is used by the frontend - so that we can define
// methods above and have auto-complete endpoints in the frontend.
export type AppRouter = Awaited<ReturnType<typeof makeAppRouter>>;
