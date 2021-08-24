import { ChangeEventHandler } from "react";

const InputField = (prop: {
  type: string;
  value: string | number;
  handleChange?: ChangeEventHandler<HTMLInputElement>;
}) => {
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
