import * as stylex from "@stylexjs/stylex"
import { motion } from "motion/react"
import { tokens } from "../tokens.stylex"

type ButtonProps = {
  text: string
  type?: "button" | "reset" | "submit"
  onClickFn: () => void
  width?: string
  bgColor?: string
  disabled?: boolean
}
export const Button = ({
  text,
  type,
  onClickFn,
  width,
  bgColor,
  disabled,
}: ButtonProps) => {
  return (
    <motion.button
      {...stylex.props(styles.base({ width, bgColor }))}
      initial={{
        boxShadow: "5px 5px",
      }}
      whileTap={{
        scale: 0.95,
        transition: { duration: 0.2 },
        boxShadow: "0px 0px",
      }}
      whileHover={{ boxShadow: "5px 5px rgb(83, 83, 83)" }}
      onClick={onClickFn}
      disabled={disabled}
    >
      {text}
    </motion.button>
  )
}

const styles = stylex.create({
  base: (props) => ({
    backgroundColor: props.bgColor,
    height: "100%",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "black",
    cursor: "pointer",
    // boxShadow: "2px 5px",
    width: "100%",
    "@media (max-width: 480px)": {
      border: "2px solid black",
      borderRadius: ".5rem",
      fontSize: "1.5rem",
      padding: "1rem",
    },
    "@media (min-width: 481px) and (max-width: 834px)": {
      border: "3px solid black",
      borderRadius: ".8rem",
      fontSize: "2rem",
      padding: "1.2rem",
    },
    "@media (min-width: 835px) ": {
      border: "4px solid black",
      borderRadius: "1rem",
      fontSize: "2.5rem",
      padding: "1.5rem",
    },
  }),
})
