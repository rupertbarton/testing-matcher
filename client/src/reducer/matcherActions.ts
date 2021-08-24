import type * as types from "src/types";

export const addOrder = (newOrder: types.order): types.action<types.order> => {
  return {
    type: "matcher/addOrder",
    payload: newOrder,
  };
};

export const getMatcherInfo = (): types.emptyAction => {
  return {
    type: "matcher/getMatcherInfo",
  };
};

export const cancelOrder = (
  orderDetails: [types.orderAction, string]
): types.action<[types.orderAction, string]> => {
  const orderAction = orderDetails[0];
  const orderId = orderDetails[1];
  return {
    type: "matcher/cancelOrder",
    payload: [orderDetails[0], orderDetails[1]],
  };
};

export const cancelAllOrders = (username: string): types.action<string> => {
  return {
    type: "matcher/cancelAllOrders",
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
