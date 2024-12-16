import queryString from "query-string"

type ExtractRouteParams<T extends string> =
  T extends `${infer _Start}:${infer Param}/${infer Rest}` // Match segments with `:param/`
    ? { [K in Param | keyof ExtractRouteParams<`/${Rest}`>]: string }
    : T extends `${infer _Start}:${infer Param}` // Match trailing `:param`
      ? { [K in Param]: string }
      : void // No `:param` found

type MakeUrlParams<
  QueryParams extends object | void,
  RouteParams extends object | void,
> = [QueryParams, RouteParams] extends [void, void]
  ? void
  : (QueryParams extends void ? {} : { queryParams: Partial<QueryParams> }) &
      (RouteParams extends void ? {} : { routeParams: RouteParams })

export const makeUrlFactory = <QueryParams extends object | void>() => {
  return <UrlType extends string>(url: UrlType) => {
    type RouteParams = ExtractRouteParams<UrlType>
    type UrlParams = MakeUrlParams<QueryParams, RouteParams>

    const makeUrl = (options?: UrlParams) => {
      // Replace route parameters in the URL
      let routePath: string = url
      if (options && "routeParams" in options && options.routeParams) {
        routePath = Object.entries(options.routeParams).reduce(
          (path, [key, value]) => path.replace(`:${key}`, value),
          url as string,
        )
      }

      // Append query parameters as a query string
      let string = ""
      if (options && "queryParams" in options && options.queryParams) {
        string = `?${queryString.stringify(options.queryParams)}`
      }

      return routePath + string
    }

    return {
      url,
      makeUrl,
    }
  }
}
