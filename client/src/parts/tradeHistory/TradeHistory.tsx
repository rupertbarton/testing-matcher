import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type * as types from "src/types";
import { RootState } from "src/app/store";
import ListItem from "src/elements/listItem";
import ListHeading from "src/elements/listHeading";
import * as matcherActions from "src/reducer/matcherActions";
import thStyle from "./tradeHistory.module.css";

const TradeHistory = () => {
  const selectMatcher = (state: RootState): types.matcherState => state.matcher;

  const matcherState = useSelector(selectMatcher);

  const tradeHistory = matcherState.tradeHistory;
  const tradeList = tradeHistory.map((trade: types.trade) => {
    return <ListItem key={trade.id} data={[trade.price, trade.volume]} />;
  });

  return (
    <div className={thStyle.tradeHistory}>
      <ul>
        <h3>{"Trade history"}</h3>
        <ListHeading key={"POBkey"} data={["Price", "Volume"]} />
        {tradeList}
      </ul>
    </div>
  );
};

export default TradeHistory;
