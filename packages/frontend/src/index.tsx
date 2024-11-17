// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { TrpcQueryContextProvider } from "./connection/TrpcQueryContextProvider";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <TrpcQueryContextProvider>
      <App />
    </TrpcQueryContextProvider>
  </React.StrictMode>,
);
