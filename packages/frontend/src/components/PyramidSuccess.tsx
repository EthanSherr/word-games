import * as stylex from "@stylexjs/stylex"
import { useState } from "react"
import ConfettiExplosion from "react-confetti-explosion"
import { trpc } from "../connection/TrpcQueryContextProvider"
import { tokens } from "../tokens.stylex"
import { Button } from "./Button"

type PyramidSuccessProps = {
  onClickFn: () => void
}
export const PyramidSuccess = ({ onClickFn }: PyramidSuccessProps) => {
  const [togglePopUpThanks, setTogglePopUpThanks] = useState(false)
  const { mutateAsync, isSuccess } = trpc.notifyUserDaily.useMutation()
  const [email, setEmail] = useState({ email: "", notify: true })
  const [emailError, setEmailError] = useState(false)

  const notifyHandler = async () => {
    if (isValidEmail()) {
      const result = await mutateAsync(email)
      setTogglePopUpThanks(true)
    } else {
      setEmailError(true)
    }

    setTimeout(() => {
      //reset everything
      onClickFn()
    }, 3000)
  }

  const isValidEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.email)
  }

  const emailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (emailError) {
      setEmailError(!emailError)
    }
    setEmail((prevState) => ({
      ...prevState,
      email: e.target.value.toLowerCase(),
    }))
  }

  // console.log("IS successs: ", isSuccess);
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
      <div>
        {!togglePopUpThanks && (
          <div>
            <div {...stylex.props(styles.textDiv)}>
              <h2>🎉 Congratulations!</h2>

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
                <div style={{ height: "1.5rem" }}>
                  {emailError && (
                    <p {...stylex.props(styles.error)}>
                      Incorrect Email Address
                    </p>
                  )}{" "}
                </div>
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
                    notifyHandler()
                  }}
                  bgColor={tokens.green}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        {togglePopUpThanks && (
          <div {...stylex.props(styles.thankDiv)}>
            <div {...stylex.props(styles.textDiv)}>
              <p>Thank you for signing up!</p>
              <p>See you tomorrow!</p>
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
  )
}

const styles = stylex.create({
  base: {
    // backgroundColor: tokens.offwhite,
    backgroundColor: "white",
    // width: "100%",
    // height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifySelf: "center",
    // width: "100%",

    "@media (max-width: 480px)": {
      border: "2px solid black",
      borderRadius: ".5rem",
      fontSize: "1rem",
      padding: "1.5rem",
      // width: "calc(100% - 3rem)",
    },
    "@media (min-width: 481px) and (max-width: 834px)": {
      border: "3px solid black",
      borderRadius: ".8rem",
      fontSize: "1.5rem",
      padding: "3rem",
    },
    "@media (min-width: 835px) ": {
      border: "4px solid black",
      borderRadius: "1rem",
      fontSize: "2rem",
      padding: "4.5rem",
    },
  },
  confettiDiv: {
    position: "relative",
    width: "100%",
    // height: "300px",
    overflow: "hidden",
  },
  confettiExplosionDiv: {
    height: "100%",
  },
  textDiv: {
    width: "100%",
    // backgroundColor: "pink",
    alignContent: "center",
    // fontSize: "1rem",
    // margin: "1.5rem",
    marginBottom: "2rem",
    alignItems: "center",
    textAlign: "center",
  },
  buttonContainerDiv: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    "@media (max-width: 480px)": {
      gap: "1rem",
    },
    "@media (min-width: 481px) and (max-width: 834px)": {
      gap: "1.5rem",
    },
    "@media (min-width: 835px) ": {
      gap: "2rem",
    },
  },
  buttonDiv: { width: "100%" },
  inputContainer: {
    width: "100%",
    // backgroundColor: "red",
    display: "flex",

    // alignContent: "center",
    // justifyContent: "center",
  },
  input: {
    backgroundColor: tokens.pink,
    zoom: "disable",
    width: "100%",
    color: "black",
    textTransform: "uppercase",
    borderRadius: ".5rem",
    textAlign: "center",
    border: "2px solid black",
    "@media (max-width: 480px)": {
      border: "2px solid black",
      borderRadius: ".5rem",
      fontSize: "1rem",
      padding: "1rem",

      // paddingTop: "1rem",
      // paddingBottom: "1rem",
    },
    "@media (min-width: 481px) and (max-width: 834px)": {
      border: "3px solid black",
      borderRadius: ".8rem",
      fontSize: "1.5rem",
      padding: "1.2rem",
      // paddingTop: "1.2rem",
      // paddingBottom: "1.2rem",
    },
    "@media (min-width: 835px) ": {
      border: "4px solid black",
      borderRadius: "1rem",
      fontSize: "2rem",
      padding: "1.5rem",
      // paddingTop: "1.5rem",
      // paddingBottom: "1.5rem",
    },
  },
  thankDiv: {
    "@media (max-width: 480px)": {
      height: "14rem",
      gap: "1rem",
      width: "20rem",
    },
    "@media (min-width: 481px) and (max-width: 834px)": {
      height: "18rem",
      gap: "1.5rem",
      width: "30rem",
    },
    "@media (min-width: 835px) ": {
      height: "23rem",
      gap: "2rem",
      width: "45rem",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifySelf: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  error: {
    color: "red",
    margin: 0,
    marginTop: ".2rem",
    "@media (max-width: 480px)": {
      fontSize: ".75rem",
    },
    "@media (min-width: 481px) and (max-width: 834px)": {
      fontSize: "1rem",
    },
    "@media (min-width: 835px) ": {
      fontSize: "1.25rem",
    },
  },
})
