import Confetti from "react-confetti";
import * as stylex from "@stylexjs/stylex";
import { Button } from "./Button";
import { tokens } from "../tokens.stylex";
import ConfettiExplosion from "react-confetti-explosion";
import { SignUp } from "./SignUp";

type PyramidSuccessProps = {
  onClickFn: () => void;
};
export const PyramidSuccess = ({ onClickFn }: PyramidSuccessProps) => {
  return (
    <div {...stylex.props(styles.base)}>
      {/* <div {...stylex.props(styles.confettiDiv)}>
        <Confetti
          width={300} // Confetti container width
          height={300} // Confetti container height
          recycle={false} // Stop confetti after animation completes
          numberOfPieces={500} // Adjust number of confetti pieces
          confettiSource={{ x: 100, y: 200, w: 300, h: 200 }}
        />
      </div> */}
      <div>
        <p>🎉 Congratulations on solving the puzzle! 🎉</p>
      </div>

      <ConfettiExplosion
        zIndex={1}
        particleCount={250}
        duration={3000}
        force={0.8}
        // height="100%"
        width={1500}
      />

      <Button text="Close" onClickFn={onClickFn} />
    </div>
  );
};

const styles = stylex.create({
  base: {
    backgroundColor: tokens.orange,
    width: "60%",
    height: "20%",
    minWidth: "30rem",
    maxWidth: "70%",
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
  confettiDiv: {
    // display: "flex",
    backgroundColor: tokens.yellow,
    position: "relative",
    width: "100%",
    // width: "300px",
    height: "300px",
    overflow: "hidden",
    // border: "1px solid #ccc",
  },
  confettiExplosionDiv: {
    width: "100%",
    height: "100%",
    backgroundColor: "pink",
  },
});
