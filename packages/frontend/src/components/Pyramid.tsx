import * as stylex from "@stylexjs/stylex";
import { PyramidCell, PyramidPrompt } from "@common/src/model/pyramid";
import { PyramidCellBox } from "./PyramidCellBox";
import { InputBox } from "./InputBox";
import { useRef, useState } from "react";
import { InputArr } from "./InputArr";

type PyramidType = {
  data: PyramidPrompt;
};
export const Pyramid = ({ data }: PyramidType) => {
  // const [dataArr, setDataArr] = useState<Array<Array<string>>>([
  //   ["P", "A", "S", "T", "A"],
  //   ["", "", "", ""],
  //   ["", "", ""],
  //   ["", ""],
  //   [""],
  // ]);

  const [dataArr, setDataArr] = useState({
    layers: [
      [
        { character: "P", editable: false },
        { character: "A", editable: false },
        { character: "S", editable: false },
        { character: "T", editable: false },
        { character: "A", editable: false },
      ],
      [
        { character: "", editable: true },
        { character: "", editable: true },
        { character: "A", editable: false },
        { character: "", editable: true },
      ],
      [
        { character: "", editable: true },
        { character: "", editable: true },

        { character: "", editable: true },
      ],
      [
        { character: "", editable: true },
        { character: "", editable: true },
      ],
      [{ character: "A", editable: false }],
    ],
  });

  const inputRefs = [
    [
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
    ],
    [
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
    ],
    [
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
    ],
    [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)],
    [useRef<HTMLInputElement>(null)],
  ];

  //for array of array
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    arrIndex: number,
    index: number,
  ) => {
    if (data.layers[arrIndex][index].editable) {
      const updatedLayers = [...dataArr.layers]; // Copy the layers array
      updatedLayers[arrIndex] = [...updatedLayers[arrIndex]]; // Copy the specific layer

      // Update the character of the specific item
      updatedLayers[arrIndex][index] = {
        ...updatedLayers[arrIndex][index],
        character: e.target.value,
      };

      // Update the state with the new layers
      setDataArr((prevState) => ({
        ...prevState,
        layers: updatedLayers,
      }));
    }

    if (
      e.target.value.length === e.target.maxLength &&
      index < inputRefs[arrIndex].length - 1
    ) {
      // go to the next  input
      for (let i = 1; i < dataArr.layers[arrIndex].length; i++) {
        if (
          //if it is editable , not just it is empty
          dataArr.layers[arrIndex][index + i].character.length <= 0
          // dataArr.layers[arrIndex][index + 1].editable
        ) {
          inputRefs[arrIndex][index + i].current?.focus();
          break;
        }
      }
    } else if (
      index == inputRefs[arrIndex].length - 1 &&
      (e.target.value.length === e.target.maxLength ||
        dataArr.layers[arrIndex][index].character.length > 0) &&
      arrIndex < dataArr.layers.length - 1
    ) {
      // console.log("  I AM END OF LINEEEE => GO TO NEXT LINE");
      inputRefs[arrIndex + 1][0].current?.focus();
    }
  };

  return (
    <div {...stylex.props(styles.base)}>
      {dataArr.layers.map((array, arrayIndex) => {
        return (
          <div key={arrayIndex} {...stylex.props(styles.pyramidRow)}>
            {array.map((arr, arrIndex) => {
              return (
                <PyramidCellBox
                  editable={arr.editable}
                  character={arr.character}
                  key={arrIndex}
                  value={arr.character}
                  onChange={(e) => handleInputChange(e, arrayIndex, arrIndex)}
                  inputRef={inputRefs[arrayIndex][arrIndex]}
                  maxLength={1}
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
  base: {
    // backgroundColor: "red",
    // margin: "3rem",
    // marginTop: "10rem",
    // marginBottom: "10rem",
    // marginLeft: "5rem",
    // marginRight: "5rem",
    // padding: "3rem",
  },
  pyramidRow: {
    // backgroundColor: "pink",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: "1rem",
    margin: "1rem",
  },
});
