import { createBrowserRouter, redirect } from "react-router-dom"
import App from "./App"
import { NotFound } from "./pages/NotFound"
import { CancelNotifications } from "./pages/CancelNotifications"
import { frontendRoutes } from "@word-games/common/src/routes/frontendRoutes"

const router = createBrowserRouter([
  {
    path: "/",
    loader: () => redirect(frontendRoutes.dailyPyramidGame.url),
  },
  {
    path: frontendRoutes.dailyPyramidGame.url,
    element: <App />,
  },
  {
    path: frontendRoutes.cancelNotification.url,
    element: <CancelNotifications />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
])

export default router
