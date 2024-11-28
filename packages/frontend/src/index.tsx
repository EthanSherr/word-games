// src/index.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { TrpcQueryContextProvider } from "./connection/TrpcQueryContextProvider"
import router from "./router"

const rootElement = document.getElementById("root")!
const root = ReactDOM.createRoot(rootElement)

root.render(
  <React.StrictMode>
    <TrpcQueryContextProvider>
      <RouterProvider router={router} />
    </TrpcQueryContextProvider>
  </React.StrictMode>,
)
