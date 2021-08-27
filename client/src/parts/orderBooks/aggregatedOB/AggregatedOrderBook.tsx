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
  orderBookBuyPrices.sort((a, b) => Number(a) - Number(b));
  const buyList = orderBookBuyPrices
    .slice(0, 10)
    .map((strprice: stringOrNumber) => {
      const price = Number(strprice);
      return (
        <ListItem
          key={"Buy" + price}
          data={[price, orderBookData.Buy[price]]}
        />
      );
    });

  const orderBookSellPrices = Object.keys(orderBookData.Sell);
  orderBookSellPrices.sort((a, b) => Number(a) - Number(b));
  const sellList = orderBookSellPrices
    .slice(0, 10)
    .map((strprice: stringOrNumber) => {
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
      <h3>{"Aggregated order book"}</h3>

      <div className={aobStyle.twoLists}>
        <ul>
          <li>
            <b>Buy list</b>
          </li>
          <ListHeading key={"AOBkeyBuy"} data={["Price", "Volume"]} />
          {buyList}
        </ul>
        <ul className={aobStyle.lastColumn}>
          <li>
            <b>Sell list</b>
          </li>
          <ListHeading key={"AOBkeySell"} data={["Price", "Volume"]} />
          {sellList}
        </ul>
      </div>
    </div>
  );
};

export default AggregatedOrderBook;
