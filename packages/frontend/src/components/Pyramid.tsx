import * as stylex from "@stylexjs/stylex";
import { PyramidCell, PyramidPrompt } from "@common/src/model/pyramid";
import { PyramidCellBox } from "./PyramidCellBox";
import { InputBox } from "./InputBox";
import { useEffect, useRef, useState } from "react";
import { InputArr } from "./InputArr";
import { Button } from "./Button";
import { tokens } from "../tokens.stylex";

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
        { character: "A", editable: false },
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
  // useEffect(() => {
  //   console.log("USE EFFECT", dataArr);
  // }, [dataArr]);

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

  const updateDataArr = (
    layerIndex: number,
    itemIndex: number,
    value: string,
  ) => {
    console.log("update the dataArr: ", value);
    //update the array
    if (dataArr.layers[layerIndex][itemIndex].editable) {
      const updatedLayers = [...dataArr.layers]; // Copy the layers array
      updatedLayers[layerIndex] = [...updatedLayers[layerIndex]]; // Copy the specific layer

      // Update the character of the specific item
      updatedLayers[layerIndex][itemIndex] = {
        ...updatedLayers[layerIndex][itemIndex],
        character: value.toUpperCase(),
      };

      // Update the state with the new layers
      setDataArr((prevState) => ({
        ...prevState,
        layers: updatedLayers,
      }));
    }
  };

  const onSelectTest = (layerIndex: number, itemIndex: number) => {
    console.log(
      "on select test - select the content so the user can update it ",
      layerIndex,
      itemIndex,
    );

    //check if curSelect is filled then empty it
    // if (dataArr.layers[layerIndex][itemIndex].character.length > 0) {
    //   updateDataArr(layerIndex, itemIndex, "");
    // }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    arrIndex: number,
    index: number,
  ) => {
    console.log("handle input change - value: ", e.target.value);

    updateDataArr(arrIndex, index, e.target.value);

    // go to the next input
    // 1. check if the current box is filled
    // 2. not out of bound
    if (
      e.target.value.length === e.target.maxLength &&
      index < inputRefs[arrIndex].length - 1
    ) {
      // go to the next input
      for (let i = 1; i < dataArr.layers[arrIndex].length; i++) {
        if (dataArr.layers[arrIndex][index + i].editable) {
          //go to the next one
          inputRefs[arrIndex][index + i].current?.focus();
          // onSelectTest(arrIndex, index + i);

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
      // inputRefs[arrIndex + 1][0].current?.focus();
      for (let i = 0; i < dataArr.layers[arrIndex + 1].length; i++) {
        if (dataArr.layers[arrIndex + 1][i].editable) {
          //go to the next one
          inputRefs[arrIndex + 1][i].current?.focus();
          // onSelectTest(arrIndex + 1, i);
          break;
        }
      }

      // will not go to the next one if the next layer's first index is not editable
    }
  };

  return (
    <div>
      <div {...stylex.props(styles.logo)}>WORD PYRAMID</div>

      <div {...stylex.props(styles.base)}>
        <div {...stylex.props(styles.pyramid)}>
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
                      onChange={(e) =>
                        handleInputChange(e, arrayIndex, arrIndex)
                      }
                      inputRef={inputRefs[arrayIndex][arrIndex]}
                      maxLength={1}
                      onSelect={() => {
                        onSelectTest(arrayIndex, arrIndex);
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
        <div {...stylex.props(styles.buttonsDiv)}>
          <Button
            text="clear"
            onClickFn={() => {
              console.log("Cancel is clicked");
            }}
          />
          <Button
            text="submit"
            onClickFn={() => {
              console.log("Submit is clicked");
            }}
          />
        </div>
      </div>
    </div>
  );
};

const styles = stylex.create({
  base: {
    // backgroundColor: "red",
    margin: "3rem",
    minWidth: "20rem",
    flexWrap: "wrap",
  },
  pyramidRow: {
    // backgroundColor: "pink",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: "1rem",
    margin: "1rem",
  },
  buttonsDiv: {
    // backgroundColor: "pink",
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    marginTop: "4rem",
  },
  logo: {
    // backgroundColor: "pink",
    fontSize: "3.5rem",
    fontWeight: "800",
    textAlign: "center",
    marginTop: "3rem",
    color: tokens.yellow,
  },
  pyramid: {
    // backgroundColor: "pink",
  },
});
