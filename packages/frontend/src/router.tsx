import { createBrowserRouter, redirect } from "react-router-dom"
import App from "./App"
import { NotFound } from "./pages/NotFound"
import { CancelNotifications } from "./pages/CancelNotifications"
import { cancelNotificationsUrl } from "@word-games/common/src/routes"

const router = createBrowserRouter([
  {
    path: "/",
    loader: () => redirect("/word-pyramid"),
  },
  {
    path: "/word-pyramid",
    element: <App />,
  },
  {
    path: cancelNotificationsUrl,
    element: <CancelNotifications />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
])

export default router
