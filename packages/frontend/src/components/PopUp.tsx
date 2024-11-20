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
    backgroundColor: "rgba(255,140,92,0.2)",
    zIndex: "1",
    position: "absolute",
    // height: "100vh",
    // width: "100vw",
    height: "100%",
    width: "100%",
    left: "0",
    top: "0",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
