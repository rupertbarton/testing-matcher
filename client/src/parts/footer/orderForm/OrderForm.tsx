import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type * as types from "src/types";
import * as matcherActions from "src/reducer/matcherActions";
import { selectUser, selectMatcher, selectSettings } from "src/app/selectors";
import { RootState } from "src/app/store";
import formStyle from "./orderForm.module.css";
import InputField from "./InputField";
import FixedInputField from "./FixedInputField";
import DropDown from "src/elements/DropDown";

const OrderForm = () => {
  const userState = useSelector(selectUser);
  const settingsState = useSelector(selectSettings);

  const dispatch = useDispatch();

  const [price, setPrice] = useState(0);
  const [volume, setVolume] = useState(0);
  const [action, setAction] = useState<types.orderAction>("Buy");

  const handlePriceChange = (e: any) => {
    setPrice(e.target.value);
  };
  const handleVolumeChange = (e: any) => {
    setVolume(e.target.value);
  };
  const handleActionChange = (e: any) => {
    setAction(e.target.value);
  };

  let ErrorMessage = "";
  let PriceError = false;
  let VolumeError = false;

  if (settingsState.currentError.slice(0, 5) === "Price") {
    ErrorMessage = settingsState.currentError;
    PriceError = true;
  } else if (settingsState.currentError.slice(0, 6) === "Volume") {
    ErrorMessage = settingsState.currentError;
    VolumeError = true;
  }

  const submitForm = () => {
    const newOrder: types.order = {
      username: userState.currentUser,
      action: action,
      price: Number(price),
      volume: Number(volume),
      timestamp: new Date().toISOString(),
      id: "",
    };
    newOrder.id = newOrder.username + newOrder.timestamp;
    dispatch(matcherActions.addOrder(newOrder));
    setPrice(0);
    setVolume(0);
  };

  return (
    <div className={formStyle.orderForm}>
      <ul>
        <h3>Order Form</h3>
        <li>
          <div className={formStyle.fieldName}>User: </div>
          <FixedInputField type={"text"} value={userState.currentUser} />
        </li>
        <li>
          <div className={formStyle.fieldName}>Action:</div>
          <DropDown
            value={action}
            options={["Buy", "Sell"]}
            handleChange={handleActionChange}
          />
        </li>
        <li>
          <div className={formStyle.fieldName}>Price: </div>
          <InputField
            type={"number"}
            value={price}
            handleChange={handlePriceChange}
            error={PriceError}
          />
        </li>
        <li>
          <div className={formStyle.fieldName}>Volume: </div>
          <InputField
            type={"number"}
            value={volume}
            handleChange={handleVolumeChange}
            error={VolumeError}
          />
        </li>

        <button onClick={submitForm}>Submit</button>
        <li className="errorMessage">{ErrorMessage}</li>
      </ul>
    </div>
  );
};

export default OrderForm;
