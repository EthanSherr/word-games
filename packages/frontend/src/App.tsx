// src/App.tsx
import * as stylex from "@stylexjs/stylex"
import React from "react"
import { Pyramid } from "./components/Pyramid"
import { trpc } from "./connection/TrpcQueryContextProvider"
import "./index.css"
import { tokens } from "./tokens.stylex"

const App: React.FC = () => {
  const { data, isLoading } = trpc.getPyramidOfTheDay.useQuery()

  return (
    <div {...stylex.props(styles.base)}>
      <div {...stylex.props(styles.logo)}>WORD PYRAMID</div>
      <div {...stylex.props(styles.pyramidDiv)}>
        {data ? <Pyramid pyramidData={data} /> : "loading"}
      </div>
    </div>
  )
}

export default App

const styles = stylex.create({
  base: {
    // backgroundColor: "lightgray",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    justifyContent: "center",
    alignContent: "center",
    marginLeft: "1rem",
    marginRight: "1rem",
  },
  logo: {
    marginTop: "2rem",
    width: "100%",
    fontWeight: "800",
    textAlign: "center",
    "@media (max-width: 480px)": {
      fontSize: "3rem",
    },
    "@media (min-width: 481px) and (max-width: 834px)": {
      fontSize: "4rem",
    },
    "@media (min-width: 835px) ": {
      fontSize: "5rem",
    },
  },
  pyramidDiv: {
    // backgroundColor: "pink",
    width: "100%",
  },
})
