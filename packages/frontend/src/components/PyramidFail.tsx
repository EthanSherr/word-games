import * as stylex from "@stylexjs/stylex"
import { motion } from "motion/react"
import { HiEmojiSad } from "react-icons/hi"
import { tokens } from "../tokens.stylex"
import { Button } from "./Button"

type PyramidFailProps = {
  onClickFn?: () => void
}
export const PyramidFail = ({ onClickFn }: PyramidFailProps) => {
  return (
    <motion.div
      {...stylex.props(styles.base, styles.motionDiv)}
      animate={{ scale: 0, x: 0, y: "-50%" }}
      transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
    >
      <HiEmojiSad {...stylex.props(styles.failEmoji)} />
      <div {...stylex.props(styles.failText)}>Try Again</div>
    </motion.div>
  )
}

const styles = stylex.create({
  base: {
    // backgroundColor: tokens.orange,
    // backgroundColor: "pink",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: "1rem",
    alignItems: "center",
    padding: "1rem",
  },
  emojiDiv: {
    padding: ".5rem",
    fontSize: "2.5em",
  },
  textDiv: {
    alignContent: "center",
    minWidth: "20rem",
    fontSize: "1rem",
    marginBottom: "1rem",
    alignItems: "center",
    textAlign: "center",
  },
  buttonContainerDiv: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: "2rem",
    margin: "1rem",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDiv: {
    height: "3rem",
    width: "40%",
    diplay: "flex",
    flexDirection: "column",
    justifyItems: "center",
    alignItems: "center",
    fontSize: ".8rem",
  },
  motionDiv: {
    zIndex: "1000",
    position: "fixed",

    // height: "80%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  failEmoji: { margin: "0", fontSize: "8em" },
  failText: {
    fontSize: "2em",
    margin: "0",
    textAlign: "center",
    backgroundColor: tokens.yellow,
    padding: "2rem",
    borderRadius: "1rem",
    border: "2px solid black",
  },
})
