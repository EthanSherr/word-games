// src/App.tsx
import React from "react";
import "./index.css";
import { Pyramid } from "./components/Pyramid";
import { trpc } from "./connection/TrpcQueryContextProvider";
import * as stylex from "@stylexjs/stylex";
import { tokens } from "./tokens.stylex";

const App: React.FC = () => {
  const { data, isLoading } = trpc.getPyramidOfTheDay.useQuery();

  // const [trpcError, pyramidDataOfTheDay] = data ?? [];
  // const data = {
  //   id: "test",
  //   layers: [
  //     [
  //       { character: "P", editable: false },
  //       { character: "A", editable: false },
  //       { character: "S", editable: false },
  //       { character: "T", editable: false },
  //       { character: "A", editable: false },
  //     ],
  //     [
  //       { character: "", editable: true },
  //       { character: "", editable: true },
  //       { character: "A", editable: false },
  //       { character: "", editable: true },
  //     ],
  //     [
  //       { character: "A", editable: false },
  //       { character: "", editable: true },

  //       { character: "", editable: true },
  //     ],
  //     [
  //       { character: "", editable: true },
  //       { character: "", editable: true },
  //     ],
  //     [{ character: "A", editable: false }],
  //   ],
  // };

  return (
    <div>
      <div {...stylex.props(styles.logo)}>WORD PYRAMID</div>
      {data ? <Pyramid pyramidData={data} /> : "loading"}
      {/* <Pyramid pyramidData={data} /> */}
    </div>
  );
};

export default App;

const styles = stylex.create({
  logo: {
    // backgroundColor: "pink",
    fontSize: "3.2rem",
    fontWeight: "800",
    textAlign: "center",
    marginTop: "3rem",
    color: tokens.orange,
    minWidth: "227px",
    // display: 'flex'
  },
});
