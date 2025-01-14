import * as stylex from "@stylexjs/stylex"
import { Length } from "@stylexjs/stylex/lib/VarTypes"
import { HiOutlineEmojiSad } from "react-icons/hi"
import { tokens } from "../tokens.stylex"

type TrackFailsType = {
  fails: number
}
export const TrackFails = ({ fails }: TrackFailsType) => {
  return (
    <div {...stylex.props(styles.base)}>
      {fails > 0 && fails <= 3 && (
        <div {...stylex.props(styles.trackFails)}>
          {Array.from({ length: fails }).map(() => {
            return (
              <HiOutlineEmojiSad
                key={Math.random()}
                {...stylex.props(styles.emoji)}
              />
            )
          })}
        </div>
      )}
      {fails > 3 && (
        <div {...stylex.props(styles.trackFails)}>
          <HiOutlineEmojiSad {...stylex.props(styles.emoji)} />
          {fails - 1}
        </div>
      )}
    </div>
  )
}

const styles = stylex.create({
  base: {
    width: "100%",
    // minHeight: "7rem",
    "@media (max-width: 480px)": {
      height: "5rem",
    },
    "@media (min-width: 481px) and (max-width: 834px)": {
      height: "6rem",
    },
    "@media (min-width: 835px) ": {
      height: "7rem",
    },

    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    fontSize: "2em",
    paddingBottom: ".5rem",
  },
  trackFails: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    // backgroundColor: tokens.red,
    alignSelf: "center",
    // height: "5rem",
  },
  emoji: {
    "@media (max-width: 480px)": {
      width: "3rem",
      height: "3rem",
    },
    "@media (min-width: 481px) and (max-width: 834px)": {
      width: "4rem",
      height: "4rem",
    },
    "@media (min-width: 835px) ": {
      width: "5rem",
      height: "5rem",
    },
  },
})
