import { ChangeEventHandler } from "react";

const InputField = (prop: {
  type: string;
  value: string | number;
  handleChange?: ChangeEventHandler<HTMLInputElement>;
}) => {
  if (prop.type === "number") {
    return (
      <input
        type={prop.type}
        min={0}
        autoFocus={true}
        value={prop.value}
        onChange={prop.handleChange}
      />
    );
  }
  return (
    <input
      type={prop.type}
      autoFocus={true}
      value={prop.value}
      onChange={prop.handleChange}
    />
  );
};

export default InputField;
