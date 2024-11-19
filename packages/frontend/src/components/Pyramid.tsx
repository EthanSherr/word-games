import * as stylex from "@stylexjs/stylex";
import { PyramidPrompt } from "@word-games/common/src/model/pyramid";
import { PyramidCellBox } from "./PyramidCellBox";
import { useRef, useState } from "react";
import { Button } from "./Button";
import { tokens } from "../tokens.stylex";
import { PopUp } from "./PopUp";
import { PyramidSuccess } from "./PyramidSuccess";
import { trpc } from "../connection/TrpcQueryContextProvider";
import { PyramidFail } from "./PyramidFail";
import { motion } from "motion/react";
import { isValid } from "zod";
import { TrackFails } from "./TrackFails";

type PyramidType = {
  pyramidData: PyramidPrompt;
};
export const Pyramid = ({ pyramidData }: PyramidType) => {
  const [popUpToggle, setPopUpToggle] = useState(false);
  const [dataArr, setDataArr] = useState<PyramidPrompt>(pyramidData);
  const { mutate, data: isValidData } = trpc.submitAnswer.useMutation();
  const [trackFails, setTrackFails] = useState(0);
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
  // const [emojiPosition, setEmojiPosition] = useState({ x: 0, y: 0 });

  const submitHandler = () => {
    setPopUpToggle(true);

    if (!isValidData) {
      setShake(true);
      // emojiHandler(isValidData);
      // setEmojiPosition((prev) => ({ x: 350, y: 100 }));
      setTrackFails((prevState) => prevState + 1);
    }

    setTimeout(() => {
      //reset everything
      // setEmojiPosition({ x: 0, y: 0 });
      setPopUpToggle(false);
      setShake(false);
    }, 1100);
  };

  return (
    <div>
      <div {...stylex.props(styles.base)}>
        <div>
          <TrackFails fails={trackFails} />
        </div>
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
              submitHandler();
            }}
          />
        </div>
      </div>
      {isValidData && popUpToggle && (
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
      {/* {!isValidData && popUpToggle && (
        <PopUp>
          <PyramidFail
            onClickFn={() => {
              setPopUpToggle(false);
              setShake(false);
              setTrackFails((prevState) => prevState + 1);
            }}
          />
        </PopUp>
      )} */}

      {!isValidData && popUpToggle && (
        <PopUp>
          {/* <motion.div
            style={{
              // position: "absolute",
              // top: emojiPosition.y,
              // left: emojiPosition.x,
              fontSize: "10rem",
              zIndex: "1000",
              position: "fixed",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            // animate={{ x: 500, y: 500, opacity: [1, 0] }}
            animate={{ scale: 0, x: 0, y: "-40%" }}
            // animate={animate ?? { scale: 0, x: 0, y: "-40%" }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
          >
            <div {...stylex.props(styles.failEmoji)}>😰</div>
            <div {...stylex.props(styles.failText)}>Try Again</div>
          </motion.div> */}
          <PyramidFail />
        </PopUp>
      )}
    </div>
  );
};

const styles = stylex.create({
  base: {
    // backgroundColor: "red",
    margin: "1rem",
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
    // backgroundColor: "pink",
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
  trackFails: {
    color: tokens.yellow,
    display: "flex",
    flexDirection: "row",
    backgroundColor: tokens.red,
    alignSelf: "center",
  },
  failEmoji: { margin: "0", backgroundColor: "pink" },
  failText: {
    fontSize: "3rem",
    margin: "0",
  },
});
