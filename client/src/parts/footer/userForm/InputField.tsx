import { ChangeEventHandler } from "react";

const InputField = (props: {
  type: string;
  value: string | number;
  handleChange?: ChangeEventHandler<HTMLInputElement>;
  error?: boolean;
}) => {
  let inputClass = "";
  if (props.error === true) {
    inputClass = "error";
  } else {
    inputClass = "";
  }
  if (props.type === "number") {
    return (
      <input
        className={inputClass}
        type={props.type}
        min={0}
        autoFocus={true}
        value={props.value}
        onChange={props.handleChange}
      />
    );
  }
  return (
    <input
      className={inputClass}
      type={props.type}
      autoFocus={true}
      value={props.value}
      onChange={props.handleChange}
    />
  );
};

export default InputField;
