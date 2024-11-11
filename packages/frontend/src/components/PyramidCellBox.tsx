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
          placeholder="___"
        ></input>
      )}

      {!editable && (
        <div {...stylex.props(styles.base, styles.nonEditableDiv)}>
          {character}
        </div>
      )}
    </div>
    // <div>
    //   <input
    //     {...stylex.props(styles.inputDiv)}
    //     type="text"
    //     value={value}
    //     onChange={onChange}
    //     maxLength={maxLength}
    //     ref={inputRef}
    //   ></input>
    // </div>
  );
};

const styles = stylex.create({
  base: {
    width: "5rem",
    height: "5rem",
    alignContent: "center",
    textAlign: "center",
    textTransform: "uppercase",
    border: "1px solid black",
  },
  editableDiv: {
    backgroundColor: tokens.green,
  },

  nonEditableDiv: {
    backgroundColor: tokens.red,
  },

  inputDiv: {
    textTransform: "uppercase",
  },
});
