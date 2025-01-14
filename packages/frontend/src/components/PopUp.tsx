import * as stylex from "@stylexjs/stylex"
import { ReactNode } from "react"
import { tokens } from "../tokens.stylex"
import { Button } from "./Button"
type PopUpProps = {
  // popUpToggleHandler: () => void;
  // text: string;
  children: ReactNode
}
export const PopUp = ({ children }: PopUpProps) => {
  return <div {...stylex.props(styles.base)}>{children}</div>
}

const styles = stylex.create({
  base: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    zIndex: "1",
    position: "absolute",
    height: "100%",
    width: "100%",
    left: "0",
    top: "0",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
})
