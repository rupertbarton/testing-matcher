import React from "react";
import dataStyle from "./dataDisplay.module.css";
import { useSelector } from "react-redux";
import { selectSettings } from "src/app/selectors";

const DataDisplay = () => {
  const settingsState = useSelector(selectSettings);
  return (
    <div className={dataStyle.dataDisplay}>{settingsState.currentError}</div>
  );
};

export default DataDisplay;
