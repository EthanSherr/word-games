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
      <ConfettiExplosion
        zIndex={1}
        particleCount={250}
        duration={3000}
        force={0.8}
        // height="100%"
        width={1500}
      />
      <div {...stylex.props(styles.textDiv)}>
        <h2>🎉 Congratulations on solving the puzzle!</h2>

        <p>
          Would you like to sign up for our daily email with puzzles, tips, and
          more?
        </p>
        <input placeholder="yourname@email."></input>

        {/* <h2>🎉 Congratulations! 🎉</h2> */}
      </div>

      <div {...stylex.props(styles.buttonContainerDiv)}>
        <Button text="No" onClickFn={onClickFn} width="40%" />
        <Button
          text="Yes!"
          onClickFn={() => {
            console.log("Sign up");
          }}
          width="40%"
        />
      </div>
    </div>
  );
};

const styles = stylex.create({
  base: {
    backgroundColor: tokens.orange,
    // width: "100%",
    // height: "100%",
    maxWidth: "50rem",
    // minHeight: "15rem",
    maxHeight: "50rem",
    // alignSelf: "center",
    // alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    // justifyItems: "center",
    // alignContent: "center",
    borderRadius: "1rem",
    alignItems: "center",
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
    // width: "100%",
    height: "100%",
    backgroundColor: "pink",
  },
  textDiv: {
    backgroundColor: "gray",
    alignContent: "center",
    minWidth: "20rem",
    fontSize: "1rem",
    margin: "2rem",
    alignItems: "center",
    textAlign: "center",
  },
  buttonContainerDiv: {
    backgroundColor: "red",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    // marginBottom: "10%",
    gap: "2rem",
    // marginTop: "6rem",
    // marginRight: "2rem",
    // padding: "1rem",
    margin: "2rem",
    alignItems: "center",
    justifyContent: "center",
  },
});
