import * as stylex from "@stylexjs/stylex";
import { tokens } from "../tokens.stylex";
import { PyramidCell } from "@common/src/model/pyramid";

export const PyramidCellBox = ({ character, editable }: PyramidCell) => {
  return (
    <div>
      {editable && (
        <div {...stylex.props(styles.base, styles.editableDiv)}>
          {character}{" "}
        </div>
      )}
      {!editable && (
        <div {...stylex.props(styles.base, styles.nonEditableDiv)}>
          {character}
        </div>
      )}
    </div>
  );
};

const styles = stylex.create({
  base: {
    width: "3rem",
    height: "3rem",
    alignContent: "center",
    textAlign: "center",
  },
  editableDiv: {
    backgroundColor: tokens.green,
  },

  nonEditableDiv: {
    backgroundColor: tokens.red,
  },
});
