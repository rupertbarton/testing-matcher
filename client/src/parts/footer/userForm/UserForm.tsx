import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type * as types from "src/types";
import * as matcherActions from "src/reducer/matcherActions";
import * as userActions from "src/reducer/userActions";
import { selectUser, selectMatcher, selectSettings } from "src/app/selectors";
import { RootState } from "src/app/store";
import formStyle from "./userForm.module.css";
import InputField from "./InputField";
import FixedInputField from "./FixedInputField";
import DropDown from "src/elements/DropDown";

const UserForm = () => {
  const dispatch = useDispatch();

  const userState = useSelector(selectUser);
  const settingsState = useSelector(selectSettings);

  let ErrorMessage = "";
  let AmountError = false;
  let LoginError = false;

  if (settingsState.currentError.slice(0, 6) === "Amount") {
    console.log("Amount");
    ErrorMessage = settingsState.currentError;
    AmountError = true;
  }

  if (settingsState.currentError.slice(0, 7) === "Invalid") {
    console.log("Login");
    ErrorMessage = settingsState.currentError;
    LoginError = true;
  }

  const [currency, setCurrency] = useState<types.currency>("GBP");
  const [amount, setAmount] = useState(0);
  const [username, setUsername] = useState("Andrea");
  const [password, setPassword] = useState("");

  const handleAmountChange = (e: any) => {
    setAmount(e.target.value);
  };
  const handleCurrencyChange = (e: any) => {
    setCurrency(e.target.value);
  };
  const handleUserChange = (e: any) => {
    console.log(username);
    console.log(password);
    dispatch(userActions.login(username, password));
    setPassword("");
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
      <ul className={formStyle.loginForm}>
        <li>
          <button onClick={() => dispatch(matcherActions.getMatcherInfo())}>
            {"\u27f3"}
          </button>
          <div id={"userField"} className={formStyle.fieldName}>
            User:{" "}
          </div>
          <DropDown
            value={username}
            options={userState.userList}
            handleChange={(e) => {
              console.log(e.target);
              setUsername(e.target.value);
            }}
          />
          <div className={formStyle.fieldName}>Password:</div>
          <InputField
            type={"password"}
            value={password}
            handleChange={(e) => {
              setPassword(e.target.value);
            }}
            error={LoginError}
          />
          <button onClick={handleUserChange}>Login</button>
        </li>
      </ul>
      <ul>
        <h3>Current User: {userState.currentUser}</h3>
        <li>
          <div className={formStyle.fieldName}>
            {"GBP: " + userState.userBalance.GBP}
          </div>
          <div>{"BTC: " + userState.userBalance.BTC}</div>
        </li>
        <li>
          <div id={"currencyField"} className={formStyle.fieldName}>
            Currency:
          </div>
          <DropDown
            value={currency}
            options={["GBP", "BTC"]}
            handleChange={handleCurrencyChange}
          />
        </li>
        <li>
          <div id={"amountField"} className={formStyle.fieldName}>
            Amount:{" "}
          </div>
          <InputField
            type={"number"}
            value={amount}
            handleChange={handleAmountChange}
            error={AmountError}
          />
        </li>
        <li className={formStyle.buttons}>
          <button onClick={topUp}>Top Up</button>
          <button onClick={withdraw}>Withdraw</button>
        </li>
        <li className="errorMessage">{ErrorMessage}</li>
      </ul>
    </div>
  );
};

export default UserForm;
