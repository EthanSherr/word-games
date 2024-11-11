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
export const PyramidCellBox = (
  // { character, editable }: PyramidCell
  {
    character,
    editable,
    value,
    onChange,
    inputRef,
    maxLength,
  }: PyramidCellBoxProps,
) => {
  // const handleInputChange = (e) => {
  //   const { maxLength, value, nextElementSibling } = e.target;
  //   console.log("what is the nextElement sibling: ", nextElementSibling);
  //   if (value.length >= maxLength && nextElementSibling) {
  //     nextElementSibling.focus();
  //   }
  // };

  return (
    // <div>
    //   {editable && (
    //     <input
    //       {...stylex.props(styles.base, styles.editableDiv)}
    //       type="text"
    //       maxLength={1}
    //       onChange={handleInputChange}
    //     ></input>
    //   )}
    //   {!editable && (
    //     <div {...stylex.props(styles.base, styles.nonEditableDiv)}>
    //       {character}
    //     </div>
    //   )}
    // </div>
    <div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        ref={inputRef}
      ></input>
    </div>
  );
};

const styles = stylex.create({
  base: {
    width: "5rem",
    height: "5rem",
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
