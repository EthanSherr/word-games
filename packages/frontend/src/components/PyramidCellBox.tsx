import * as stylex from "@stylexjs/stylex";
import { tokens } from "../tokens.stylex";
import { PyramidCell } from "@common/src/model/pyramid";

type PyramidCellBoxProps = {
  character?: string;
  editable?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  maxLength: number;
};
export const PyramidCellBox = ({
  character,
  editable,
  value,
  onChange,
  inputRef,
  maxLength,
}: PyramidCellBoxProps) => {
  return (
    <div>
      {editable && (
        <input
          {...stylex.props(styles.base, styles.editableDiv)}
          type="text"
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          ref={inputRef}
          placeholder="_"
        ></input>
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
    fontSize: "2rem",
    width: "4rem",
    height: "4rem",
    // minWidth: "3rem",
    // minHeight: "3rem",
    // maxWidth: "5rem",
    // maxHeight: "5rem",
    // alignContent: "center",
    // textAlign: "center",
    textTransform: "uppercase",
    border: "0px solid black",
    borderRadius: ".5rem",
    // gap: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  editableDiv: {
    backgroundColor: tokens.green,
    textAlign: "center",
    // fontSize: "2rem",
    // fontWeight: "1srem",
  },

  nonEditableDiv: {
    backgroundColor: tokens.red,
    // fontWeight: "1rem",
  },
});
