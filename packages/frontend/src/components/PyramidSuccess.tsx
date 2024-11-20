import * as stylex from "@stylexjs/stylex";
import { Button } from "./Button";
import { tokens } from "../tokens.stylex";
import ConfettiExplosion from "react-confetti-explosion";
import { useState } from "react";
import { trpc } from "../connection/TrpcQueryContextProvider";

type PyramidSuccessProps = {
  onClickFn: () => void;
};
export const PyramidSuccess = ({ onClickFn }: PyramidSuccessProps) => {
  const [togglePopUp, setTogglePopUp] = useState(false);

  const { mutateAsync, isSuccess } = trpc.notifyUserDaily.useMutation();
  const [email, setEmail] = useState({ email: "", notify: true });
  const [emailError, setEmailError] = useState(false);

  const notifyHandler = async () => {
    if (isValidEmail()) {
      const result = await mutateAsync(email);
      setTogglePopUp(true);
      console.log("Mutate Async Result: ", result);
    } else {
      setEmailError(true);
    }
  };

  const isValidEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isValidEmail = emailRegex.test(email.email);
    console.log("isValidEmail: ", isValidEmail);
    return isValidEmail;
  };

  const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (emailError) {
      setEmailError(!emailError);
    }
    setEmail((prevState) => ({
      ...prevState,
      email: e.target.value.toLowerCase(),
    }));
  };

  console.log("IS successs: ", isSuccess);
  return (
    <div>
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
                Would you like to sign up for our daily email with puzzles,
                tips, and more?
              </p>
              <div {...stylex.props(styles.inputContainer)}>
                <input
                  {...stylex.props(styles.input)}
                  placeholder="yourname@email.com"
                  onChange={emailHandler}
                ></input>
                {emailError && (
                  <p {...stylex.props(styles.error)}>Incorrect Email Address</p>
                )}
              </div>
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
                    notifyHandler();
                  }}
                  bgColor={tokens.green}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        {togglePopUp && (
          <div {...stylex.props(styles.thankDiv)}>
            <div {...stylex.props(styles.textDiv)}>
              Thank you for signing up! See you tomorrow!
            </div>
            <div {...stylex.props(styles.buttonContainerDiv, styles.buttonDiv)}>
              <Button
                text="Okay"
                onClickFn={onClickFn}
                bgColor={tokens.green}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = stylex.create({
  base: {
    backgroundColor: tokens.offwhite,
    // width: "100%",
    // height: "100%",
    // maxWidth: "50rem",
    maxWidth: "90%",
    // minHeight: "15rem",
    maxHeight: "50rem",
    // alignSelf: "center",
    // alignItems: "center",
    borderRadius: "1rem",
    border: "2px solid black",
    boxShadow: "5px 8px",
    display: "flex",
    flexDirection: "column",
    // alignContent: "center",
    // justifyContent: "center",
    alignItems: "center",
    // justifyItems: "center",
    // alignSelf: "center",
    justifySelf: "center",
  },
  confettiDiv: {
    backgroundColor: tokens.yellow,
    position: "relative",
    width: "100%",
    height: "300px",
    overflow: "hidden",
  },
  confettiExplosionDiv: {
    height: "100%",
    backgroundColor: "pink",
  },
  textDiv: {
    alignContent: "center",
    minWidth: "15rem",
    fontSize: "1rem",
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
    backgroundColor: tokens.pink,
    zoom: "disable",
    width: "60%",
    minWidth: "18rem",
    padding: ".5rem",
    // width: "4rem",
    // height: "4rem",
    color: "black",
    textTransform: "uppercase",
    borderRadius: ".5rem",
    textAlign: "center",
    border: "2px solid black",
  },
  thankDiv: {
    backgroundColor: tokens.offwhite,

    maxWidth: "90%",
    maxHeight: "50rem",

    borderRadius: "1rem",
    border: "2px solid black",
    boxShadow: "5px 8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifySelf: "center",
  },
  inputContainer: {
    height: "3.2rem",
    // backgroundColor: tokens.orange,
  },
  error: {
    color: "red",
    fontSize: ".8rem",
    margin: 0,
  },
});
