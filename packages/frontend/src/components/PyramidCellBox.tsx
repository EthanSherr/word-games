import * as stylex from "@stylexjs/stylex";
import { tokens } from "../tokens.stylex";

type PyramidCellBoxProps = {
  editable: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};
export const PyramidCellBox = ({
  editable,
  value,
  onChange,
  inputRef,
}: PyramidCellBoxProps) => {
  return (
    <input
      {...stylex.props(styles.input(editable))}
      disabled={!editable}
      type="text"
      value={value}
      onChange={onChange}
      maxLength={1}
      ref={inputRef}
      placeholder="_"
      onFocus={(event) => {
        event.target.select();
      }}
    ></input>
  );
};

const styles = stylex.create({
  input: (editable) => ({
    backgroundColor: editable === true ? tokens.green : tokens.yellow,
    zoom: "disable",
    fontSize: "2rem",
    width: "4rem",
    height: "4rem",
    color: "black",
    textTransform: "uppercase",
    border: "0px solid black",
    borderRadius: ".5rem",

    textAlign: "center",
  }),
});
