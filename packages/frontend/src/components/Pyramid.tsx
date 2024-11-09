import * as stylex from "@stylexjs/stylex";
import { PyramidPrompt } from "@common/src/model/pyramid";
import { PyramidCellBox } from "./PyramidCellBox";

type PyramidType = {
  data: PyramidPrompt;
};
export const Pyramid = ({ data }: PyramidType) => {
  return (
    <div {...stylex.props(styles.base)}>
      {data.layers.map((array, arrayIndex) => {
        return (
          <div {...stylex.props(styles.pyramidRow)}>
            {array.map((arr, arrIndex) => {
              console.log("arr: ", arr);
              return (
                <PyramidCellBox
                  key={arrIndex}
                  character={arr.character.length == 0 ? "_" : arr.character}
                  editable={arr.editable}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const styles = stylex.create({
  base: { backgroundColor: "red" },
  pyramidRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
});
