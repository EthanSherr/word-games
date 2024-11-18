import * as stylex from "@stylexjs/stylex";
import { PyramidPrompt } from "@word-games/common/src/model/pyramid";
import { PyramidCellBox } from "./PyramidCellBox";
import { useRef, useState } from "react";
import { Button } from "./Button";
import { tokens } from "../tokens.stylex";
import { PopUp } from "./PopUp";
import { PyramidSuccess } from "./PyramidSuccess";
import { trpc } from "../connection/TrpcQueryContextProvider";

type PyramidType = {
  pyramidData: PyramidPrompt;
};
export const Pyramid = ({ pyramidData }: PyramidType) => {
  const [popUpToggle, setPopUpToggle] = useState(false);
  const [dataArr, setDataArr] = useState<PyramidPrompt>(pyramidData);

  // const { mutate, data: isValidData } = trpc.submitAnswer.useMutation();
  // const [] = isValidData ?? [];
  // console.log("is Valid data: ", isValidData);
  // setPopUpToggle(isValidData);
  // const [pyramidError, setPyramidError] = useState(isValidData);
  // const [dataArr, setDataArr] = useState({
  //   layers: [
  //     [
  //       { character: "P", editable: false },
  //       { character: "A", editable: false },
  //       { character: "S", editable: false },
  //       { character: "T", editable: false },
  //       { character: "A", editable: false },
  //     ],
  //     [
  //       { character: "", editable: true },
  //       { character: "", editable: true },
  //       { character: "A", editable: false },
  //       { character: "", editable: true },
  //     ],
  //     [
  //       { character: "A", editable: false },
  //       { character: "", editable: true },

  //       { character: "", editable: true },
  //     ],
  //     [
  //       { character: "", editable: true },
  //       { character: "", editable: true },
  //     ],
  //     [{ character: "A", editable: false }],
  //   ],
  // });

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

  const clearAllInput = () => {
    const updatedLayers = [...dataArr.layers]; // Copy the layers array

    for (let i = 0; i < dataArr.layers.length; i++) {
      updatedLayers[i] = [...updatedLayers[i]]; // Copy the layer i
      // Update the character of the specific item
      for (let x = 0; x < dataArr.layers[i].length; x++) {
        if (dataArr.layers[i][x].editable) {
          updatedLayers[i][x] = {
            ...updatedLayers[i][x],
            character: "",
          };
        }
      }
    }

    // Update the state with the new layers
    setDataArr((prevState) => ({
      ...prevState,
      layers: updatedLayers,
    }));
  };

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    arrIndex: number,
    itemIndex: number,
  ) => {
    updateDataArr(arrIndex, itemIndex, e.target.value);

    // go to the next input
    // 1. check if the current box is filled
    // 2. not out of bound
    if (
      e.target.value.length === e.target.maxLength &&
      itemIndex < inputRefs[arrIndex].length - 1
    ) {
      for (let i = 1; i < dataArr.layers[arrIndex].length; i++) {
        if (dataArr.layers[arrIndex][itemIndex + i].editable) {
          inputRefs[arrIndex][itemIndex + i].current?.focus();
          break;
        }
      }
    } else if (
      itemIndex == inputRefs[arrIndex].length - 1 &&
      arrIndex < dataArr.layers.length - 1 &&
      (e.target.value.length === e.target.maxLength ||
        dataArr.layers[arrIndex][itemIndex].character.length > 0)
    ) {
      for (let i = 0; i < dataArr.layers[arrIndex + 1].length; i++) {
        if (dataArr.layers[arrIndex + 1][i].editable) {
          inputRefs[arrIndex + 1][i].current?.focus();
          break;
        }
      }
    }
  };

  const [shake, setShake] = useState(false);
  return (
    <div>
      <div {...stylex.props(styles.base)}>
        <div {...stylex.props(styles.pyramid)}>
          {dataArr?.layers.map((array, arrayIndex) => {
            return (
              <div key={arrayIndex} {...stylex.props(styles.pyramidRow)}>
                {array.map((item, itemIndex) => {
                  return (
                    <PyramidCellBox
                      editable={item.editable}
                      key={itemIndex}
                      value={item.character}
                      onChange={(e) =>
                        handleInputChange(e, arrayIndex, itemIndex)
                      }
                      inputRef={inputRefs[arrayIndex][itemIndex]}
                      isShaking={shake}
                      // sendFnToParent={shakeHandler}
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
            bgColor={tokens.yellow}
            onClickFn={() => {
              clearAllInput();
            }}
          />
          <Button
            text="submit"
            bgColor={tokens.green}
            onClickFn={() => {
              console.log(
                "Submit is clicked => Check if the puzzle is solved! If Solved, success! If not error ",
                dataArr,
              );
              // clearAllInput();
              // mutate(dataArr);
              setPopUpToggle(true);
            }}
          />
        </div>
      </div>
      // valid data then pop up
      {/* {isValidData && popUpToggle && (
        <PopUp>
          <div>
            <PyramidSuccess
              onClickFn={() => {
                setPopUpToggle(false);
              }}
            />
          </div>
        </PopUp>
      )}
      // not valid data then pop up
      {!isValidData && popUpToggle && (
        <PopUp>
          <div>
            <div {...stylex.props(styles.text)}>Hi Your asnwer was wrong</div>
            <Button
              text="Okay"
              onClickFn={() => {
                clearAllInput();
                setPopUpToggle(false);
              }}
            />
          </div>
        </PopUp>
      )} */}
      <Button
        text="shake"
        onClickFn={() => {
          setShake(!shake);
        }}
      />
    </div>
  );
};

const styles = stylex.create({
  base: {
    // backgroundColor: "red",
    margin: "2rem",
    minWidth: "20rem",
    flexWrap: "wrap",
    // height: "100%",
    // minHeight: "40rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
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
    marginTop: "2rem",
  },

  pyramid: {
    backgroundColor: "pink",
  },
  text: {
    margin: "1rem",
    marginTop: "0rem",
    // padding: "1rem",
    fontSize: "2em",
    color: "black",
    // backgroundColor: tokens.yellow,
    textAlign: "center",
  },
});
