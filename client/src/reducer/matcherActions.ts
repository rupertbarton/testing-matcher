import {
  addOrderSocket,
  deleteAllOrderSocket,
  deleteOrderSocket,
} from "src/app/sagas/sockets";
import type * as types from "src/types";

export const addOrder = (newOrder: types.order): types.action<types.order> => {
  addOrderSocket(newOrder);
  return {
    type: "matcher/newOrder/deprecated",
    payload: newOrder,
  };
};

export const getMatcherInfo = (): types.emptyAction => {
  return {
    type: "matcher/getMatcherInfo",
  };
};

export const cancelOrder = (orderId: string): types.action<string> => {
  deleteOrderSocket(orderId);
  return {
    type: "matcher/cancelOrder/deprecated",
    payload: orderId,
  };
};

export const cancelAllOrders = (username: string): types.action<string> => {
  deleteAllOrderSocket(username);
  return {
    type: "matcher/cancelAllOrders/deprecated",
    payload: username,
  };
};

export const setAggregatedOrderBook = (
  aggregatedOrderBook: types.aggregatedOB
) => {
  return {
    type: "matcher/setAggregatedOrderBook",
    payload: aggregatedOrderBook,
  };
};

export const setPersonalOrderBook = (personalOrderBook: types.personalOB) => {
  return {
    type: "matcher/setPersonalOrderBook",
    payload: personalOrderBook,
  };
};

export const setTradeHistory = (tradeHistory: types.trade[]) => {
  return {
    type: "matcher/setTradeHistory",
    payload: tradeHistory,
  };
};
