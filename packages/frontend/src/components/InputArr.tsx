import { useState } from "react";

export const InputArr = () => {
  const [dataArr, setDataArr] = useState<Array<Array<string>>>([
    ["a", "", "", "c", ""],
    ["", "", "", ""],
    ["", "", ""],
  ]);

  const handleInputChange = (e) => {
    const { maxLength, value, nextElementSibling } = e.target;
    console.log("");
    if (value.length >= maxLength && nextElementSibling) {
      nextElementSibling.focus();
    }
  };
  return (
    <div>
      {dataArr.map((row, rowIndex) => {
        return (
          <div>
            {row.map((item, itemIndex) => {
              return (
                <input
                  type="text"
                  maxLength={1}
                  onChange={handleInputChange}
                  style={{ width: "30px", margin: "5px", textAlign: "center" }}
                />
              );
            })}{" "}
          </div>
        );
      })}
    </div>
  );
};
