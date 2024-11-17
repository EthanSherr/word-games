// src/App.tsx
import React from "react";
import "./index.css";
import { Pyramid } from "./components/Pyramid";
import { trpc } from "./connection/TrpcQueryContextProvider";

const App: React.FC = () => {
  const { data, isLoading } = trpc.getPyramidOfTheDay.useQuery();

  const [trpcError, pyramidDataOfTheDay] = data ?? [];

  return (
    <div>
      {pyramidDataOfTheDay ? (
        <Pyramid pyramidData={pyramidDataOfTheDay} />
      ) : (
        "loading"
      )}
    </div>
  );
};

export default App;
