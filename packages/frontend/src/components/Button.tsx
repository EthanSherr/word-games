import * as stylex from "@stylexjs/stylex";
import { tokens } from "../tokens.stylex";
import { motion } from "motion/react";

type ButtonProps = {
  text: string;
  type?: "button" | "reset" | "submit";
  onClickFn: () => void;
  width?: string;
  bgColor?: string;
};
export const Button = ({
  text,
  type,
  onClickFn,
  width,
  bgColor,
}: ButtonProps) => {
  return (
    <motion.button
      {...stylex.props(styles.base({ width, bgColor }))}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      onClick={onClickFn}
    >
      {text}
    </motion.button>
  );
};

const styles = stylex.create({
  base: (props) => ({
    // backgroundColor: props.text === "submit" ? tokens.green : tokens.yellow,
    backgroundColor: props.bgColor,

    minWidth: "10rem",
    // width: "80%",
    width: props.width && props.width.length > 0 ? props.width : "80%",
    maxWidth: "40rem",
    fontSize: "2em",
    // height: "5rem",
    maxHeight: "5rem",
    height: "100%",
    textTransform: "uppercase",
    border: "0px solid black",
    borderRadius: ".5rem",
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "black",
    cursor: "pointer",
  }),
});
