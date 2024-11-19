import * as stylex from "@stylexjs/stylex";
import { tokens } from "../tokens.stylex";
import { motion } from "motion/react";

type PyramidCellBoxProps = {
  editable: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isShaking: boolean;
  // sendFnToParent: (fn: () => void) => void;
  // shakeHandler: () => {};
};

export const PyramidCellBox = ({
  editable,
  value,
  onChange,
  inputRef,
  // sendFnToParent,
  isShaking,
}: PyramidCellBoxProps) => {
  const randomX = Math.floor(Math.random() * 10) + 1;
  const randomY = Math.floor(Math.random() * 10) + 1;
  const randomRotate = Math.floor(Math.random() * 50) + 1;

  // console.log("random Rotate: ", randomRotate);
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
        duration: 0.5,
        ease: "easeInOut",
        // repeat: Infinity,
      },
    },
    // initial: { x: 0 },
  };

  return (
    <motion.input
      animate={isShaking && editable ? "shake" : "initial"}
      variants={shakeAnimation}
      ref={inputRef}
      // ref={divRef}
      {...stylex.props(styles.input(editable))}
      disabled={!editable}
      type="text"
      value={value}
      onChange={onChange}
      maxLength={1}
      placeholder="_"
      onFocus={(event) => {
        event.target.select();
      }}
    ></motion.input>
  );
};

const styles = stylex.create({
  input: (editable) => ({
    backgroundColor: editable === true ? tokens.green : tokens.yellow,
    zoom: "disable",
    fontSize: "2rem",
    width: "4rem",
    height: "4rem",
    color: "black",
    textTransform: "uppercase",
    border: "0px solid black",
    borderRadius: ".5rem",

    textAlign: "center",
  }),
});
