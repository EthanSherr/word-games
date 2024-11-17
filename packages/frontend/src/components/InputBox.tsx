export const InputBox = () => {
  const handleInputChange = (e) => {
    const { maxLength, value, nextElementSibling } = e.target;

    if (value.length >= maxLength && nextElementSibling) {
      nextElementSibling.focus();
    }
  };
  return (
    <div>
      <input
        type="text"
        maxLength={1}
        onChange={handleInputChange}
        style={{ width: "30px", margin: "5px", textAlign: "center" }}
      />
      <input
        type="text"
        maxLength={1}
        onChange={handleInputChange}
        style={{ width: "30px", margin: "5px", textAlign: "center" }}
      />
      <input
        type="text"
        maxLength={1}
        onChange={handleInputChange}
        style={{ width: "30px", margin: "5px", textAlign: "center" }}
      />
      <input
        type="text"
        maxLength={1}
        onChange={handleInputChange}
        style={{ width: "30px", margin: "5px", textAlign: "center" }}
      />
    </div>
  );
};
