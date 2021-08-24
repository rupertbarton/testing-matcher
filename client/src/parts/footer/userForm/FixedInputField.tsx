const FixedInputField = (prop: {
  type: string;
  value: string | number;
  handleChange?: () => void;
}) => {
  return (
    <input
      type={prop.type}
      autoFocus={true}
      value={prop.value}
      disabled={true}
    />
  );
};

export default FixedInputField;
