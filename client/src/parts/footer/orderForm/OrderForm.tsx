import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type * as types from "src/types";
import * as matcherActions from "src/reducer/matcherActions";
import { RootState } from "src/app/store";
import formStyle from "./orderForm.module.css";
import InputField from "./InputField";
import FixedInputField from "./FixedInputField";
import DropDown from "src/elements/DropDown";

const OrderForm = () => {
  const selectUser = (state: RootState): types.userState => state.user;
  const selectMatcher = (state: RootState): types.matcherState => state.matcher;

  const dispatch = useDispatch();

  const userState = useSelector(selectUser);
  const matcherState = useSelector(selectMatcher);

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
          />
        </li>
        <li>
          <div className={formStyle.fieldName}>Volume: </div>
          <InputField
            type={"number"}
            value={volume}
            handleChange={handleVolumeChange}
          />
        </li>

        <button onClick={submitForm}>Submit</button>
      </ul>
    </div>
  );
};

export default OrderForm;
