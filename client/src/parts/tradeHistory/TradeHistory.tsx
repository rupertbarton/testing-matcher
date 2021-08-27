import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type * as types from "src/types";
import { RootState } from "src/app/store";
import ListItem from "src/elements/listItem";
import ListHeading from "src/elements/listHeading";
import * as matcherActions from "src/reducer/matcherActions";
import thStyle from "./tradeHistory.module.css";
import { setCurrentObject } from "src/reducer/settingsActions";

const TradeHistory = () => {
  const selectMatcher = (state: RootState): types.matcherState => state.matcher;

  const dispatch = useDispatch();
  const matcherState = useSelector(selectMatcher);

  const tradeHistory = matcherState.tradeHistory;
  let tradeList = tradeHistory.map((trade: types.trade, i) => {
    let colors = ["", ""];
    let change: "up" | "down" | "level";
    if (trade.price > tradeHistory[i - 1]?.price) {
      colors[1] = "green";
    } else if (trade.price < tradeHistory[i - 1]?.price) {
      colors[1] = "red";
    } else {
      colors[1] = "grey";
    }
    return (
      <ListItem
        key={trade.id}
        data={[trade.volume, trade.price]}
        colors={colors}
        onClick={() => {
          dispatch(setCurrentObject(trade));
        }}
      />
    );
  });

  tradeList.reverse();

  return (
    <div className={thStyle.tradeHistory}>
      <ul>
        <h3>{"Trade history"}</h3>
        <ListHeading key={"Tradekey"} data={["Volume", "Price"]} />
        {tradeList}
      </ul>
    </div>
  );
};

export default TradeHistory;
