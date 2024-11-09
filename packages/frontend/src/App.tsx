// src/App.tsx
import React from "react";
import { trpc } from "./connection/TrpcQueryContextProvider";

const App: React.FC = () => {
  const { data, isLoading, error } = trpc.getPyramidGameToday.useQuery();

  return (
    <div>
      {isLoading && "loading..."}
      {data && <pre>{JSON.stringify(data, null, 4)}</pre>}
      <h1>Goodbye, Vite + React + TypeScript!</h1>
      <p>Start editing to see some magic happen :)</p>
    </div>
  );
};

export default App;
