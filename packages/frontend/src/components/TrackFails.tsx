import * as stylex from "@stylexjs/stylex";
import { tokens } from "../tokens.stylex";
import { HiOutlineEmojiSad } from "react-icons/hi";

type TrackFailsType = {
  fails: number;
};
export const TrackFails = ({ fails }: TrackFailsType) => {
  return (
    <div {...stylex.props(styles.base)}>
      {fails > 0 && fails <= 3 && (
        <div {...stylex.props(styles.trackFails)}>
          {Array.from({ length: fails }).map((index) => {
            return <HiOutlineEmojiSad />;
          })}
        </div>
      )}
      {fails > 3 && (
        <div {...stylex.props(styles.trackFails)}>
          <HiOutlineEmojiSad />+{fails - 1}
        </div>
      )}
    </div>
  );
};

const styles = stylex.create({
  base: {
    // backgroundColor: "red",
    width: "100%",
    minHeight: "3rem",
    // height: "3rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    fontSize: "2em",
    paddingBottom: ".5rem",
  },
  trackFails: {
    // color: tokens.yellow,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    // backgroundColor: tokens.red,
    alignSelf: "center",
  },
});
