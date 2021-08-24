import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type * as types from "src/types";
import { RootState } from "src/app/store";
import ListItem from "src/elements/listItem";
import ListHeading from "src/elements/listHeading";
import * as matcherActions from "src/reducer/matcherActions";
import aobStyle from "./aggregatedOB.module.css";
type stringOrNumber = string | number;

const AggregatedOrderBook = () => {
  const selectUser = (state: RootState): types.userState => state.user;
  const selectMatcher = (state: RootState): types.matcherState => state.matcher;

  const userState = useSelector(selectUser);
  const matcherState = useSelector(selectMatcher);

  const dispatch = useDispatch();

  const orderBookData = matcherState.aggregatedOrderBook;
  const orderBookBuyPrices = Object.keys(orderBookData.Buy);
  const buyList = orderBookBuyPrices.map((strprice: stringOrNumber) => {
    const price = Number(strprice);
    return (
      <ListItem key={"Buy" + price} data={[price, orderBookData.Buy[price]]} />
    );
  });

  const orderBookSellPrices = Object.keys(orderBookData.Sell);
  const sellList = orderBookSellPrices.map((strprice: stringOrNumber) => {
    const price = Number(strprice);
    return (
      <ListItem
        key={"Sell" + price}
        data={[price, orderBookData.Sell[price]]}
      />
    );
  });

  return (
    <div className={aobStyle.aggregatedOrderBook}>
      <ul>
        <h3>{"Aggregated order book"}</h3>

        <ListHeading key={"AOBkey"} data={["Price", "Volume"]} />
        <div>Buy orders</div>
        {buyList}
        <div>Sell orders</div>
        {sellList}
      </ul>
    </div>
  );
};

export default AggregatedOrderBook;
