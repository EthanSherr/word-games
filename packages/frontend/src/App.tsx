// src/App.tsx
import React from "react";
import "./index.css";
import { Pyramid } from "./components/Pyramid";
import { PyramidPrompt } from "@word-games/common/src/model/pyramid";

const App: React.FC = () => {
  const data: PyramidPrompt = {
    layers: [
      [
        { character: "P", editable: false },
        { character: "A", editable: false },
        { character: "S", editable: false },
        { character: "T", editable: false },
        { character: "A", editable: false },
      ],
      [
        { character: "", editable: true },
        { character: "", editable: true },
        { character: "", editable: true },
        { character: "", editable: true },
      ],
      [
        { character: "", editable: true },
        { character: "", editable: true },

        { character: "", editable: true },
      ],
      [
        { character: "", editable: true },
        { character: "", editable: true },
      ],
      [{ character: "A", editable: false }],
    ],
  };

  return (
    <div>
      <h1>Start editing to see some magic happen :)</h1>
      <Pyramid data={data} />
    </div>
  );
};

export default App;
