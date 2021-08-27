import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type * as types from "src/types";
import * as matcherActions from "src/reducer/matcherActions";
import * as userActions from "src/reducer/userActions";
import { RootState } from "src/app/store";
import formStyle from "./userForm.module.css";
import InputField from "./InputField";
import FixedInputField from "./FixedInputField";
import DropDown from "src/elements/DropDown";

const UserForm = () => {
  const selectUser = (state: RootState): types.userState => state.user;
  const selectMatcher = (state: RootState): types.matcherState => state.matcher;

  const dispatch = useDispatch();

  const userState = useSelector(selectUser);
  const matcherState = useSelector(selectMatcher);

  const [currency, setCurrency] = useState<types.currency>("GBP");
  const [amount, setAmount] = useState(0);

  const handleAmountChange = (e: any) => {
    setAmount(e.target.value);
  };
  const handleCurrencyChange = (e: any) => {
    setCurrency(e.target.value);
  };
  const handleUserChange = (e: any) => {
    dispatch(userActions.setUser(e.target.value));
  };

  const topUp = () => {
    dispatch(userActions.topUp(currency, Number(amount)));
    setAmount(0);
  };

  const withdraw = () => {
    dispatch(userActions.withdraw(currency, Number(amount)));
    setAmount(0);
  };

  return (
    <div className={formStyle.userForm}>
      <ul>
        <h3>User details</h3>
        <li>
          <div className={formStyle.fieldName}>User: </div>
          <DropDown
            value={userState.currentUser}
            options={userState.userList}
            handleChange={handleUserChange}
          />{" "}
        </li>
        <li>
          <div className={formStyle.fieldName}>
            {"GBP: " + userState.userBalance.GBP}
          </div>
          <div>{"BTC: " + userState.userBalance.BTC}</div>
        </li>
        <li>
          <div className={formStyle.fieldName}>Currency:</div>
          <DropDown
            value={currency}
            options={["GBP", "BTC"]}
            handleChange={handleCurrencyChange}
          />
        </li>
        <li>
          <div className={formStyle.fieldName}>Amount: </div>
          <InputField
            type={"number"}
            value={amount}
            handleChange={handleAmountChange}
          />
        </li>
        <li className={formStyle.buttons}>
          <button onClick={topUp}>Top Up</button>
          <button onClick={withdraw}>Withdraw</button>
        </li>
      </ul>
    </div>
  );
};

export default UserForm;
