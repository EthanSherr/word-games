import * as stylex from "@stylexjs/stylex";
import { PyramidCell, PyramidPrompt } from "@common/src/model/pyramid";
import { PyramidCellBox } from "./PyramidCellBox";
import { InputBox } from "./InputBox";
import { useRef, useState } from "react";

type PyramidType = {
  data: PyramidPrompt;
};
export const Pyramid = ({ data }: PyramidType) => {
  // const handleInputChange = (e) => {
  //   const { maxLength, value, nextElementSibling } = e.target;
  //   console.log("what is the next element silbing: ", nextElementSibling);
  //   if (value.length >= maxLength && nextElementSibling) {
  //     nextElementSibling.focus();
  //   }
  // };

  // const [values, setValues] = useState<string[]>(["a", "", "", "c", ""]);
  const [dataArr, setDataArr] = useState<Array<Array<string>>>([
    ["a", "", "", "c", ""],
    ["", "", "", ""],
    ["", "", ""],
  ]);
  const [refArrIndex, setRefArrIndex] = useState(0);
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
  ];

  // for one array
  // const handleInputChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   index: number,
  // ) => {
  //   const newValues = [...values];
  //   newValues[index] = e.target.value;
  //   setValues(newValues);

  //   console.log("In handle input change: ", newValues, e.target.value);

  //   // Automatically move focus to the next input if maxLength is reached
  //   if (
  //     e.target.value.length === e.target.maxLength &&
  //     index < inputRefs.length - 1
  //     // && //check if next one is already have value or not
  //     // values[index + 1].length <= 0
  //   ) {
  //     // inputRefs[index + 1].current?.focus();
  //     for (let i = 1; i <= values.length; i++) {
  //       if (values[index + i].length <= 0) {
  //         inputRefs[index + i].current?.focus();
  //         break;
  //       }
  //     }
  //   }
  // };

  //for array of array
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    arrIndex: number,
    index: number,
  ) => {
    // const newValues = [...values];
    // newValues[index] = e.target.value;
    // setValues(newValues);
    const newArray = [...dataArr];
    newArray[arrIndex][index] = e.target.value;
    setDataArr(newArray);
    setRefArrIndex(arrIndex);

    console.log("In handle input change function: e", e.target.value);
    console.log("What is the arrIndex: ", arrIndex, ", Index: ", index);

    // // Automatically move focus to the next input for the current array
    // if (
    //   e.target.value.length === e.target.maxLength &&
    //   index < inputRefs[arrIndex].length - 1
    // ) {
    //   for (let i = 1; i <= dataArr[arrIndex].length; i++) {
    //     console.log("in IF stmt: ArrIndex ", arrIndex, ", index", index);

    //     if (dataArr[arrIndex][index + i].length <= 0) {
    //       inputRefs[arrIndex][index + i].current?.focus();
    //       // inputRefs[refArrIndex][index + i].current?.focus();
    //       break;
    //     } else {
    //       //break from current array not to the next array
    //       console.log("BREAKK: Not found");
    //     }
    //   }
    // }
    //  else {
    //   //

    //   console.log(
    //     "END OF CURRENT ARRAY:::: Current: ArrIndex ",
    //     arrIndex,
    //     ", index",
    //     index,
    //   );
    //   // go to the next line

    //   arrIndex = arrIndex + 1;
    //   index = 0;
    //   console.log("Updated: ArrIndex ", arrIndex, ", index", index);

    //   // console.log("what is now: ");
    //   // break;
    // }

    if (
      e.target.value.length === e.target.maxLength &&
      // dataArr[arrIndex][index].length === e.target.maxLength &&
      index < inputRefs[arrIndex].length - 1
    ) {
      console.log(
        "in IF stmt: ArrIndex ",
        e.target.value.length,
        "what is cur Dataarr[arrIndex][index]: ",
        // dataArr[arrIndex][index],
      );

      // go to the next empty input
      for (let i = 1; i < dataArr[arrIndex].length; i++) {
        if (dataArr[arrIndex][index + i].length <= 0) {
          inputRefs[arrIndex][index + i].current?.focus();
          break;
        }
      }
    } else if (
      // check if it is end of line and have value then go to the  next line
      index == inputRefs[arrIndex].length - 1 &&
      (e.target.value.length === e.target.maxLength ||
        dataArr[arrIndex][index].length > 0)
    ) {
      if (arrIndex < dataArr.length - 1) {
        console.log("  I AM END OF LINEEEE => GO TO NEXT LINE");

        inputRefs[arrIndex + 1][0].current?.focus();
      }
    }
  };

  return (
    <div>
      {/* <div {...stylex.props(styles.base)}>
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

                /// this one works but when the array ends the next one has null for next line
                //   if (arr.editable) {
                //     return (
                //       <input
                //         // {...stylex.props(styles.base, styles.editableDiv)}
                //         type="text"
                //         maxLength={1}
                //         onChange={handleInputChange}
                //       ></input>
                //     );
                //   } else {
                //     return (
                //       <div
                //       // {...stylex.props(styles.base, styles.nonEditableDiv)}
                //       >
                //         {arr.character}
                //       </div>
                //     );
                //   }

             
              })}
            </div>
          );
        })}
      </div> */}

      <InputBox />

      <div>
        {/* {values.map((val, index) => (
          <PyramidCellBox
            key={index}
            value={val}
            onChange={(e) => handleInputChange(e, index)}
            inputRef={inputRefs[index]}
            maxLength={1}
          />
        ))} */}
        {dataArr.map((array, arrayIndex) => {
          return (
            <div key={arrayIndex} {...stylex.props(styles.pyramidRow)}>
              {array.map((arr, arrIndex) => {
                // console.log("arr: ", arr);

                return (
                  <PyramidCellBox
                    key={arrIndex}
                    value={arr}
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
