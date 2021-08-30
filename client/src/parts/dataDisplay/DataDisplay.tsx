import React, { useEffect, useRef } from "react";
import dataStyle from "./dataDisplay.module.css";
import { useSelector } from "react-redux";
import { selectSettings } from "src/app/selectors";
import { LineChart } from "./depthChart/DepthChart.jsx";
import { selectMatcher } from "src/app/selectors";

let width = 100;
let height = 100;

const DataDisplay = () => {
  const matcherState = useSelector(selectMatcher);

  useEffect(() => {
    const svg = document.getElementById(dataStyle.depthChart);
    if (svg?.getBoundingClientRect()) {
      const svgWidth = svg.getBoundingClientRect().width;
      const svgHeight = svg.getBoundingClientRect().height;

      width = 0.9 * svgWidth;
      height = 0.75 * svgHeight;
    }
  });

  console.log(width);

  return (
    <div className={dataStyle.dataDisplay} id="dataDisplay">
      <div id={dataStyle.depthChart}>
        <LineChart
          data={matcherState.aggregatedOrderBook}
          width={width}
          height={height}
        />
      </div>
    </div>
  );
};

export default DataDisplay;
