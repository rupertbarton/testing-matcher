import { ChangeEventHandler } from "react";

const DropDown = (prop: {
  value: string;
  options: string[];
  handleChange?: ChangeEventHandler<HTMLSelectElement>;
}) => {
  const options = prop.options.map((option) => (
    <option key={option} value={option}>
      {option}
    </option>
  ));
  return (
    <select value={prop.value} onChange={prop.handleChange}>
      {options}
    </select>
  );
};

export default DropDown;
