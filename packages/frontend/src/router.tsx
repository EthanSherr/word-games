import { createBrowserRouter, redirect } from "react-router-dom"
import App from "./App"
import { NotFound } from "./pages/NotFound"
import { CancelNotifications } from "./pages/CancelNotifications"

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
    path: "/cancel-notifications",
    element: <CancelNotifications />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
])

export default router
