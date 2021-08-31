import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type * as types from "src/types";
import * as matcherActions from "src/reducer/matcherActions";
import { RootState } from "src/app/store";
import formStyle from "./orderDisplay.module.css";
import { current } from "@reduxjs/toolkit";
import { setCurrentObject } from "src/reducer/settingsActions";

const OrderDisplay = () => {
  const selectSettings = (state: RootState): types.settingsState =>
    state.settings;

  const dispatch = useDispatch();

  const settingsState = useSelector(selectSettings);

  const capitalise = (word: string) =>
    word[0].toLocaleUpperCase() + word.slice(1, word.length);

  const DisplayField = (props: {
    mykey: types.tradekey | types.orderkey;
    value: string | number | Date;
  }) => {
    return (
      <li>
        <div className={formStyle.fieldName}>
          {capitalise(props.mykey) + ":"}
        </div>
        <div>{props.value}</div>
      </li>
    );
  };

  const DisplayOrder = (props: { currentObject: types.currentObject }) => {
    const currentObject = props.currentObject;
    if (currentObject === undefined) {
      return null;
    }
    let objectInfo;
    let objectType;
    if ("buyer" in currentObject) {
      objectType = "Trade";
      //let keys = Object.keys(currentObject);
      let keys: types.tradekey[] = [
        "buyer",
        "seller",
        "volume",
        "price",
        "timestamp",
      ];
      objectInfo = keys.map((key: types.tradekey) => {
        if (key in currentObject) {
          const value = currentObject[key] as string | number | Date;
          return (
            <DisplayField key={key + "display"} mykey={key} value={value} />
          );
        }
      });
    } else if ("username" in currentObject) {
      objectType = "Order";
      let keys: types.orderkey[] = [
        "username",
        "action",
        "volume",
        "price",
        "timestamp",
      ];
      objectInfo = keys.map((key: types.orderkey) => {
        if (key in currentObject) {
          const value = currentObject[key] as string | number | Date;
          return (
            <DisplayField key={key + "display"} mykey={key} value={value} />
          );
        }
      });
    }
    //let keys: types.tradekey[] = Object.keys(currentObject);

    /*let mykeys = Object.keys(currentObject) as Array<
      types.tradekey | types.orderkey
    >;
    mykeys = mykeys.filter((mykey) => mykey !== "id");
    const objectInfo = mykeys.map((key: types.tradekey | types.orderkey) => {
      if (key in currentObject) {
        const value = currentObject[mykey] as string | number | Date | undefined;
        return <DisplayField mykey={mykey} value={value} />;
      }
    });*/

    return (
      <div className={formStyle.orderForm}>
        <div className={formStyle.topRow}>
          <button onClick={() => dispatch(setCurrentObject(undefined))}>
            X
          </button>
        </div>
        <ul>
          <h3>{objectType}</h3>
          {objectInfo}
        </ul>
      </div>
    );
  };

  return <DisplayOrder currentObject={settingsState.currentObject} />;
};

export default OrderDisplay;
