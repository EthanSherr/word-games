import * as stylex from "@stylexjs/stylex";
import { Button } from "./Button";
import { tokens } from "../tokens.stylex";
import ConfettiExplosion from "react-confetti-explosion";
import { useState } from "react";

type PyramidSuccessProps = {
  onClickFn: () => void;
};
export const PyramidSuccess = ({ onClickFn }: PyramidSuccessProps) => {
  const [togglePopUp, setTogglePopUp] = useState(false);
  return (
    <div {...stylex.props(styles.base)}>
      <ConfettiExplosion
        zIndex={1}
        particleCount={250}
        duration={3000}
        force={0.8}
        // height="100%"
        width={1500}
      />
      {!togglePopUp && (
        <div>
          <div {...stylex.props(styles.textDiv)}>
            <h2>🎉 Congratulations on solving the puzzle!</h2>

            <p>
              Would you like to sign up for our daily email with puzzles, tips,
              and more?
            </p>
            <input
              {...stylex.props(styles.input)}
              placeholder="yourname@email.com"
            ></input>

            {/* <h2>🎉 Congratulations! 🎉</h2> */}
          </div>
          <div {...stylex.props(styles.buttonContainerDiv)}>
            <div {...stylex.props(styles.buttonDiv)}>
              <Button
                text="No"
                onClickFn={onClickFn}
                bgColor={tokens.yellow}
                // width="40%"
              />
            </div>
            <div {...stylex.props(styles.buttonDiv)}>
              <Button
                text="Yes!"
                onClickFn={() => {
                  console.log("Sign up => Need to check for valid email");
                  setTogglePopUp(true);
                }}
                bgColor={tokens.green}
                // width="40%"
              />
            </div>
          </div>
        </div>
      )}

      {togglePopUp && (
        <div {...stylex.props(styles.base)}>
          <div {...stylex.props(styles.textDiv)}>
            Thank you for signing up! See you tomorrow!
          </div>
          <div {...stylex.props(styles.buttonContainerDiv, styles.buttonDiv)}>
            <Button
              text="Okay"
              onClickFn={onClickFn}
              bgColor={tokens.yellow}
              // width="40%"
            />
          </div>{" "}
        </div>
      )}
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
    // margin: "1rem",
    // padding: "1rem",
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
    // backgroundColor: "gray",
    alignContent: "center",
    minWidth: "20rem",
    fontSize: "1rem",
    // marginLeft: "1rem",
    // marginRight: "1rem",
    // marginTop: "1rem",
    margin: "1.5rem",
    marginBottom: "1rem",
    alignItems: "center",
    textAlign: "center",
  },
  buttonContainerDiv: {
    // backgroundColor: "red",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    // height: "5rem",
    // marginBottom: "10%",
    gap: "2rem",
    // marginTop: "6rem",
    // marginRight: "2rem",
    // padding: "1rem",
    margin: "1rem",
    // marginBottom: "2rem",
    // paddingBottom: "1rem",
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
  input: {
    backgroundColor: tokens.yellow,
    zoom: "disable",
    width: "60%",
    minWidth: "18rem",
    padding: ".5rem",
    // width: "4rem",
    // height: "4rem",
    color: "black",
    textTransform: "uppercase",
    border: "0px solid black",
    borderRadius: ".5rem",
    textAlign: "center",
  },
});
