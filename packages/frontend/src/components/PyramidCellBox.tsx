import * as stylex from "@stylexjs/stylex"
import { motion } from "motion/react"
import { tokens } from "../tokens.stylex"

type PyramidCellBoxProps = {
  editable: boolean
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void

  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  inputRef: React.RefObject<HTMLInputElement>
  isShaking: boolean
  // sendFnToParent: (fn: () => void) => void;
  // shakeHandler: () => {};
}

export const PyramidCellBox = ({
  editable,
  value,
  onChange,
  onKeyDown,
  inputRef,
  // sendFnToParent,
  isShaking,
}: PyramidCellBoxProps) => {
  const randomX = Math.floor(Math.random() * 10) + 1
  const randomY = Math.floor(Math.random() * 10) + 1
  const randomRotate = Math.floor(Math.random() * 50) + 1

  const shakeAnimation = {
    shake: {
      rotate: [
        randomRotate * -1,
        randomRotate,
        randomRotate * -1,
        randomRotate,
        0,
      ],

      x: [randomX, randomX * -1, randomX, randomX * -1, 0],
      y: [randomY * -1, randomY, randomY * -1, randomY, 0],

      transition: {
        duration: 0.3,
        ease: "easeInOut",
        // repeat: Infinity,
      },
    },
  }
  return (
    <motion.input
      animate={isShaking === true && editable ? "shake" : "initial"}
      variants={shakeAnimation}
      ref={inputRef}
      {...stylex.props(styles.input(editable))}
      disabled={!editable}
      type="text"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      maxLength={1}
      placeholder="_"
      onFocus={(event) => {
        event.target.select()
      }}
      // onAnimationComplete={() => console.log("Animation completed")}
    ></motion.input>
  )
}

const styles = stylex.create({
  input: (editable) => ({
    backgroundColor: editable === true ? tokens.green : tokens.pink,
    zoom: "disable",

    "@media (max-width: 480px)": {
      width: "4rem",
      height: "4rem",
      border: "2px solid black",
      borderRadius: ".5rem",
      fontSize: "2rem",
    },
    "@media (min-width: 481px) and (max-width: 834px)": {
      width: "5rem",
      height: "5rem",
      border: "3px solid black",
      borderRadius: ".8rem",
      fontSize: "2.5rem",
    },
    "@media (min-width: 835px) ": {
      width: "7rem",
      height: "7rem",
      border: "4px solid black",
      borderRadius: "1rem",
      fontSize: "3rem",
    },

    // color: "black",
    textTransform: "uppercase",
    textAlign: "center",
  }),
})
