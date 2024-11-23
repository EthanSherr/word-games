type ExtractRouteParams<T extends string> =
  T extends `${infer _Start}:${infer Param}/${infer Rest}` // Match segments with `:param/`
    ? { [K in Param | keyof ExtractRouteParams<`/${Rest}`>]: string }
    : T extends `${infer _Start}:${infer Param}` // Match trailing `:param`
      ? { [K in Param]: string }
      : {} // No `:param` found

// Cool idea!
type RouteParams = ExtractRouteParams<"/users/:userId">

export const cancelNotificationsUrl = "/cancel-notifications"
export const makeCancelNotificationUrl = (queryParams: { email: string }) =>
  `${cancelNotificationsUrl}?${new URLSearchParams(queryParams).toString()}`

export const dailyPyramidUrl = "/daily-pyramid"
export const makeDailyPyramidUrl = () => dailyPyramidUrl
