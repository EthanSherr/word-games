import * as stylex from "@stylexjs/stylex"
import { PyramidPrompt } from "@word-games/common/src/model/pyramid"
import { motion } from "motion/react"
import { useRef, useState } from "react"
import { isValid } from "zod"
import { trpc } from "../connection/TrpcQueryContextProvider"
import { tokens } from "../tokens.stylex"
import { Button } from "./Button"
import { PopUp } from "./PopUp"
import { PyramidCellBox } from "./PyramidCellBox"
import { PyramidFail } from "./PyramidFail"
import { PyramidSuccess } from "./PyramidSuccess"
import { TrackFails } from "./TrackFails"

type PyramidType = {
  pyramidData: PyramidPrompt
}
export const Pyramid = ({ pyramidData }: PyramidType) => {
  const [popUpToggle, setPopUpToggle] = useState(false)
  const [dataArr, setDataArr] = useState<PyramidPrompt>(pyramidData)
  const { mutateAsync, data: isValidData } = trpc.submitAnswer.useMutation()
  const [trackFails, setTrackFails] = useState(0)
  const [shake, setShake] = useState(false)

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
  ]

  const clearAllInput = () => {
    const updatedLayers = [...dataArr.layers] // Copy the layers array

    for (let i = 0; i < dataArr.layers.length; i++) {
      updatedLayers[i] = [...updatedLayers[i]] // Copy the layer i
      // Update the character of the specific item
      for (let x = 0; x < dataArr.layers[i].length; x++) {
        if (dataArr.layers[i][x].editable) {
          updatedLayers[i][x] = {
            ...updatedLayers[i][x],
            character: "",
          }
        }
      }
    }

    // Update the state with the new layers
    setDataArr((prevState) => ({
      ...prevState,
      layers: updatedLayers,
    }))
  }

  const updateDataArr = (
    layerIndex: number,
    itemIndex: number,
    value: string,
  ) => {
    // console.log("update the dataArr with value: ", value);
    //update the array
    if (dataArr.layers[layerIndex][itemIndex].editable) {
      const updatedLayers = [...dataArr.layers] // Copy the layers array
      updatedLayers[layerIndex] = [...updatedLayers[layerIndex]] // Copy the specific layer

      // Update the character of the specific item
      updatedLayers[layerIndex][itemIndex] = {
        ...updatedLayers[layerIndex][itemIndex],
        character: value.toUpperCase(),
      }

      // Update the state with the new layers
      setDataArr((prevState) => ({
        ...prevState,
        layers: updatedLayers,
      }))
    }
    // console.log("updated array: ", dataArr);
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    arrIndex: number,
    itemIndex: number,
  ) => {
    if (e.target.value.length > 0) {
      updateDataArr(arrIndex, itemIndex, e.target.value)

      // go to the next input
      // 1. check if the current box is filled
      // 2. not out of bound
      if (
        e.target.value.length === e.target.maxLength &&
        itemIndex < inputRefs[arrIndex].length - 1
      ) {
        for (let i = 1; i < dataArr.layers[arrIndex].length; i++) {
          if (dataArr.layers[arrIndex][itemIndex + i].editable) {
            inputRefs[arrIndex][itemIndex + i].current?.focus()
            break
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
            inputRefs[arrIndex + 1][i].current?.focus()
            break
          }
        }
      }
    }
  }

  const submitHandler = async () => {
    console.log("submit array: ", dataArr)
    setPopUpToggle(true)

    const x = await mutateAsync(dataArr)
    console.log("is Valid data?", isValidData)
    if (isValidData === false) {
      setShake(true)
      setTrackFails((prevState) => prevState + 1)

      setTimeout(() => {
        //reset everything
        setPopUpToggle(false)
        setShake(false)
      }, 1100)
    }
  }

  const backspaceKeyDownHanlder = (
    event: React.KeyboardEvent<HTMLInputElement>,
    arrayIndex: number,
    itemIndex: number,
  ) => {
    if (event.key.toLowerCase() === "backspace") {
      // console.log("In delete : delete is pressed: ", event.key);
      //when delete is pressed and curr item has data , delete it
      if (
        dataArr.layers[arrayIndex][itemIndex].character.length > 0 &&
        dataArr.layers[arrayIndex][itemIndex].editable
      ) {
        // console.log("In delete : call the update array ");
        updateDataArr(arrayIndex, itemIndex, "")
      } else {
        //if cur index is not the begining and the prev one is editable > go
        if (itemIndex > 0) {
          // console.log("In delete: go to prev one");
          for (let i = 1; i < dataArr.layers[arrayIndex].length; i++) {
            if (dataArr.layers[arrayIndex][itemIndex - i].editable) {
              inputRefs[arrayIndex][itemIndex - i].current?.focus()
              break
            }
          }
        }

        //if cur index is at the beginning and there are layers above >  go to above layer
        if (itemIndex == 0 && arrayIndex > 0) {
          // console.log("In delete: go to prev LAYER");

          // for (let i = 1; i < dataArr.layers.length; i++) {
          const getTheLastIndexOfPrevLayer: number =
            dataArr.layers[arrayIndex - 1].length
          for (let x = 1; x < dataArr.layers[arrayIndex - 1].length; x++) {
            if (
              dataArr.layers[arrayIndex - 1][getTheLastIndexOfPrevLayer - x]
                .editable
            ) {
              console.log(
                "what is arrI : ",
                arrayIndex - 1,
                getTheLastIndexOfPrevLayer - x,
                inputRefs[arrayIndex - 1][getTheLastIndexOfPrevLayer - x],
              )

              inputRefs[arrayIndex - 1][
                getTheLastIndexOfPrevLayer - x
              ].current?.focus()

              break
            }
          }
        }
        // }
      }
    }
  }

  return (
    <div>
      <div {...stylex.props(styles.base)}>
        <div>
          <TrackFails fails={trackFails} />
          {isValidData && (
            <p {...stylex.props(styles.text2)}>
              Whoa You did it! Come back tomorrow for a new challenge!
            </p>
          )}
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
                      onKeyDown={(e) => {
                        backspaceKeyDownHanlder(e, arrayIndex, itemIndex)
                      }}
                      inputRef={inputRefs[arrayIndex][itemIndex]}
                      isShaking={shake}
                      // sendFnToParent={shakeHandler}
                    />
                  )
                })}
              </div>
            )
          })}
          <div {...stylex.props(styles.buttonsDiv)}>
            <Button
              text="clear"
              bgColor={tokens.yellow}
              onClickFn={() => {
                clearAllInput()
              }}
            />
            <Button
              text="submit"
              bgColor={tokens.green}
              onClickFn={() => {
                submitHandler()
              }}
            />
          </div>
        </div>
      </div>

      {isValidData && popUpToggle && (
        <PopUp>
          <div>
            <PyramidSuccess
              onClickFn={() => {
                setPopUpToggle(false)
              }}
            />
          </div>
        </PopUp>
      )}

      {isValidData === false && popUpToggle && (
        <PopUp>
          <PyramidFail />
        </PopUp>
      )}
    </div>
  )
}

const styles = stylex.create({
  base: {
    // backgroundColor: "lightgray",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
  },
  pyramid: {
    // backgroundColor: "pink",
    display: "flex",
    flexDirection: "column",
    marginBottom: "2rem",
  },
  pyramidRow: {
    // backgroundColor: "red",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    "@media (max-width: 480px) ": {
      gap: ".5rem",
      marginBottom: ".5rem",
    },
    "@media (min-width: 481px) and (max-width: 834px) ": {
      gap: "1rem",
      marginBottom: "1rem",
    },

    "@media (min-width: 835px) ": {
      gap: "1.5rem",
      marginBottom: "1.5rem",
    },

    maxWidth: "100%",
    boxSizing: "border-box",
  },

  pyramidCell: {
    // backgroundColor: "pink",
    fontSize: "2rem",
    textTransform: "uppercase",
    border: "2px solid black",
    borderRadius: ".5rem",

    textAlign: "center",
    // width: "100%",
    // aspectRatio: "1",
    "@media (max-width: 480px)": { color: "yellow" },
  },

  buttonsDiv: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    marginTop: "2rem",
  },

  text: {
    margin: "1rem",
    marginTop: "0rem",
    fontSize: "2em",
    color: "black",
    textAlign: "center",
  },
  text2: {
    margin: "0",
    // marginTop: "0rem",
    // padding: "1rem",
    fontSize: "1em",
    fontWeight: "800",
    color: tokens.pink,
    // backgroundColor: tokens.yellow,
    textAlign: "center",
  },
  trackFails: {
    // backgroundColor: "pink",
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
})
