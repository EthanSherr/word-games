import * as stylex from "@stylexjs/stylex";
import { tokens } from "../tokens.stylex";
import { motion } from "motion/react";

type ButtonProps = {
  text: string;
  type?: "button" | "reset" | "submit";
  onClickFn: () => void;
};
export const Button = ({ text, type, onClickFn }: ButtonProps) => {
  return (
    <motion.button
      {...stylex.props(styles.base({ text }))}
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
    backgroundColor:
      props && props.text === "submit" ? tokens.green : tokens.yellow,

    minWidth: "20rem",
    width: "80%",
    maxWidth: "40rem",
    fontSize: "2rem",
    height: "5rem",
    textTransform: "uppercase",
    border: "0px solid black",
    borderRadius: ".5rem",
    padding: "2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "black",
    cursor: "pointer",
  }),
});
