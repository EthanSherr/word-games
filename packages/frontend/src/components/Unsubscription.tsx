import * as stylex from "@stylexjs/stylex"
import { motion } from "motion/react"

type UnsubscriptionType = {
  unsubscribe: () => void
  cancel: () => void
}
export const Unsubscription = ({ unsubscribe, cancel }: UnsubscriptionType) => {
  return (
    <div {...stylex.props(styles.base)}>
      <div>We are sad to see you go.</div>
      <div> Are you sure you want to cancel your subscription?</div>
      <div {...stylex.props(styles.buttonsContainer)}>
        <motion.button
          {...stylex.props(styles.button("red"))}
          initial={{
            boxShadow: "5px 5px",
          }}
          whileTap={{
            scale: 0.95,
            transition: { duration: 0.2 },
            boxShadow: "0px 0px",
          }}
          whileHover={{ boxShadow: "5px 5px rgb(83, 83, 83)" }}
          onClick={unsubscribe}
        >
          Yes, cancel my subscription.
        </motion.button>
        <motion.button
          {...stylex.props(styles.button("green"))}
          initial={{
            boxShadow: "5px 5px",
          }}
          whileTap={{
            scale: 0.95,
            transition: { duration: 0.2 },
            boxShadow: "0px 0px",
          }}
          whileHover={{ boxShadow: "5px 5px rgb(83, 83, 83)" }}
          onClick={cancel}
        >
          Never mind.
        </motion.button>
      </div>
    </div>
  )
}

const styles = stylex.create({
  base: {
    width: "100%",
    height: "40rem",
    // backgroundColor: "pink",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "@media (max-width: 480px)": {
      fontSize: "1rem",
    },
    "@media (min-width: 481px) and (max-width: 834px)": {
      fontSize: "1.25rem",
    },
    "@media (min-width: 835px) ": {
      fontSize: "1.5rem",
    },
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "column",
    width: "30rem",
    height: "10rem",
    gap: "1rem",
    marginTop: "2rem",
    // backgroundColor: "gray",
  },
  button: (color) => ({
    backgroundColor: color,
    height: "100%",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "black",
    cursor: "pointer",
    width: "100%",
    "@media (max-width: 480px)": {
      border: "2px solid black",
      borderRadius: ".5rem",
      fontSize: "1rem",
      padding: ".75rem",
    },
    "@media (min-width: 481px) and (max-width: 834px)": {
      border: "3px solid black",
      borderRadius: ".8rem",
      fontSize: "1.25rem",
      padding: "1rem",
    },
    "@media (min-width: 835px) ": {
      border: "4px solid black",
      borderRadius: "1rem",
      fontSize: "1.5rem",
      padding: "1.25rem",
    },
  }),
})
