import * as stylex from "@stylexjs/stylex";
import { tokens } from "../tokens.stylex";
import { Button } from "./Button";
import { motion } from "motion/react";
import { HiEmojiSad } from "react-icons/hi";

type PyramidFailProps = {
  onClickFn?: () => void;
};
export const PyramidFail = ({ onClickFn }: PyramidFailProps) => {
  return (
    // <div {...stylex.props(styles.base)}>
    //   <div {...stylex.props(styles.emojiDiv)}>😰</div>
    //   <div {...stylex.props(styles.textDiv)}>Not quite! try again?</div>
    //   <div {...stylex.props(styles.buttonContainerDiv, styles.buttonDiv)}>
    //     <Button
    //       text="Okay"
    //       onClickFn={() => {
    //         onClickFn();
    //       }}
    //     />
    //   </div>

    // </div>
    <motion.div
      {...stylex.props(styles.motionDiv)}
      // animate={{ x: 500, y: 500, opacity: [1, 0] }}
      animate={{ scale: 0, x: 0, y: "-50%" }}
      // animate={animate ?? { scale: 0, x: 0, y: "-40%" }}
      transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
    >
      {/* <div {...stylex.props(styles.failEmoji)}>😰</div> */}
      <HiEmojiSad {...stylex.props(styles.failEmoji)} />

      <div {...stylex.props(styles.failText)}>Try Again</div>
    </motion.div>
  );
};

const styles = stylex.create({
  base: {
    backgroundColor: tokens.orange,
    maxWidth: "50rem",
    maxHeight: "50rem",
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
    // margin: "1.5rem",
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
    // fontSize: "1rem",
    zIndex: "1000",
    position: "fixed",
    // maxWidth: "25rem",
    // maxHeight: "18rem",
    // width: "50%",
    // height: "50%",
    // width: "100%",
    height: "80%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // borderRadius: "1rem",
    // backgroundColor: tokens.orange,
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
});
