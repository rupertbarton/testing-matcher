import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type * as types from "src/types";
import { RootState } from "src/app/store";
import ListItem from "src/elements/listItem";
import ListHeading from "src/elements/listHeading";
import * as matcherActions from "src/reducer/matcherActions";
import pobStyle from "./personalOB.module.css";
import * as settingsActions from "src/reducer/settingsActions";

const PersonalOrderBook = () => {
  const selectUser = (state: RootState): types.userState => state.user;
  const selectMatcher = (state: RootState): types.matcherState => state.matcher;

  const userState = useSelector(selectUser);
  const matcherState = useSelector(selectMatcher);

  const dispatch = useDispatch();

  const orderBookData = matcherState.personalOrderBook;
  const buyList = orderBookData.Buy.map((order: types.order) => {
    return (
      <ListItem
        key={order.id}
        data={[order.price, order.volume, order.action]}
        onClick={() => {
          dispatch(settingsActions.setCurrentObject(order));
        }}
        onDelete={() => {
          dispatch(matcherActions.cancelOrder(order.id));
        }}
      />
    );
  });

  const sellList = orderBookData.Sell.map((order: types.order) => {
    return (
      <ListItem
        key={order.id}
        data={[order.price, order.volume, order.action]}
        onDelete={() => {
          dispatch(matcherActions.cancelOrder(order.id));
        }}
        onClick={() => {
          dispatch(settingsActions.setCurrentObject(order));
        }}
      />
    );
  });

  return (
    <div className={pobStyle.personalOrderBook}>
      <ul>
        <h3>{"Personal order book"}</h3>

        <ListHeading
          key={"POBkey"}
          data={["Price", "Volume", "Action", "Cancel"]}
          class={"padded"}
        />
        <div className={pobStyle.orderList}>
          {buyList}
          {sellList}
        </div>
      </ul>
    </div>
  );
};

export default PersonalOrderBook;
