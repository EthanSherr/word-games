import { makeUrlFactory } from "./makeUrlFactory"

export const frontendRoutes = {
  dailyPyramidGame: makeUrlFactory()("/daily-pyramid"),
  cancelNotification: makeUrlFactory<{ email: string }>()(
    "/cancel-notifications",
  ),
} as const
