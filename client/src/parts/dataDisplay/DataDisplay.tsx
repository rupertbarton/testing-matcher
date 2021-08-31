import React, { useEffect, useRef } from "react";
import dataStyle from "./dataDisplay.module.css";
import { useSelector } from "react-redux";
import { selectSettings } from "src/app/selectors";
import { DepthChart } from "./depthChart/DepthChart.jsx";
import { selectMatcher } from "src/app/selectors";
import { CandleChart } from "./candleChart/CandleChart";
import { getMatcherInfo } from "src/reducer/matcherActions";

let depthWidth = 100;
let depthHeight = 100;
let candleWidth = 100;
let candleHeight = 100;

const DataDisplay = () => {
  const matcherState = useSelector(selectMatcher);

  useEffect(() => {
    const depthSvg = document.getElementById(dataStyle.depthChart);
    if (depthSvg?.getBoundingClientRect()) {
      const depthSvgWidth = depthSvg.getBoundingClientRect().width;
      const depthSvgHeight = depthSvg.getBoundingClientRect().height;

      depthWidth = 0.95 * depthSvgWidth;
      depthHeight = depthSvgHeight - 30;
    }
    const candleSvg = document.getElementById(dataStyle.candleChart);
    if (candleSvg?.getBoundingClientRect()) {
      const candleSvgWidth = candleSvg.getBoundingClientRect().width;
      const candleSvgHeight = candleSvg.getBoundingClientRect().height;

      candleWidth = 0.95 * candleSvgWidth;
      candleHeight = candleSvgHeight - 35;
    }
  });

  return (
    <div className={dataStyle.dataDisplay} id="dataDisplay">
      <div id={dataStyle.candleChart}>
        <CandleChart
          data={matcherState.tradeHistory}
          width={candleWidth}
          height={candleHeight}
        />
      </div>
      <div id={dataStyle.depthChart}>
        <DepthChart
          data={matcherState.aggregatedOrderBook}
          width={depthWidth}
          height={depthHeight}
        />
      </div>
    </div>
  );
};

export default DataDisplay;
