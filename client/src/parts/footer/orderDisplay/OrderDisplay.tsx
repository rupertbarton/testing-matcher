import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type * as types from "src/types";
import * as matcherActions from "src/reducer/matcherActions";
import { RootState } from "src/app/store";
import formStyle from "./orderDisplay.module.css";

const OrderDisplay = () => {
  const selectSettings = (state: RootState): types.settingsState =>
    state.settings;

  const dispatch = useDispatch();

  const settingsState = useSelector(selectSettings);

  const DisplayField = (props: {
    key: string;
    value: string | number | Date;
  }) => {
    return (
      <li>
        <div className={formStyle.fieldName}>{props.key}</div>
        <div>{props.value}</div>
      </li>
    );
  };

  const DisplayOrder = (props: { currentObject: types.currentObject }) => {
    const currentObject = props.currentObject;
    if (currentObject === undefined) {
      return null;
    }
    let keys = Object.keys(currentObject);
    keys = keys.filter((key) => key !== "id");
    const objectInfo = keys.map((key) => {
      const value: string | number | Date = currentObject[key];
      return <DisplayField key={key} value={currentObject[key]} />;
    });

    return (
      <ul>
        <h3>Order Form</h3>
        {objectInfo}
      </ul>
    );
  };

  return (
    <div className={formStyle.orderForm}>
      <DisplayOrder object={settingsState.currentObject} />
    </div>
  );
};

export default OrderDisplay;
