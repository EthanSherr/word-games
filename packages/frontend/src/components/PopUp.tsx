import * as stylex from "@stylexjs/stylex";
import { tokens } from "../tokens.stylex";
import { Button } from "./Button";
import { ReactNode } from "react";
type PopUpProps = {
  // popUpToggleHandler: () => void;
  // text: string;
  children: ReactNode;
};
export const PopUp = ({ children }: PopUpProps) => {
  return (
    <div {...stylex.props(styles.base)}>
      {children}

      {/* <div {...stylex.props(styles.centerDiv)}>
        <div {...stylex.props(styles.text)}>{text}</div> 
        <Button text="Okay" onClickFn={popUpToggleHandler} />
      </div> */}
    </div>
  );
};

const styles = stylex.create({
  base: {
    backgroundColor: "rgba(47,55,100,0.6)",
    zIndex: "1",

    position: "absolute",
    height: "100vh",
    width: "100vw",
    left: "0",
    top: "0",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  centerDiv: {
    backgroundColor: tokens.orange,
    width: "60%",
    height: "20%",
    minWidth: "25rem",
    maxWidth: "40rem",
    minHeight: "15rem",
    maxHeight: "40rem",
    // alignSelf: "center",
    // alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    // justifyItems: "center",
    // alignContent: "center",
    borderRadius: "1rem",
    alignItems: "center",
    // alignSelf: "center",
  },
  text: {
    margin: "1rem",
    marginTop: "0rem",
    // padding: "1rem",
    fontSize: "2em",
    color: "black",
    // backgroundColor: tokens.yellow,
    textAlign: "center",
  },
});
