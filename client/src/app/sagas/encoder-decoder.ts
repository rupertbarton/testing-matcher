import type * as types from "src/types";

export function decodeResponse(response: types.incomingresponse) {
  let aggregatedOB: types.aggregatedOB = { Buy: {}, Sell: {} };
  for (let price in response.aggregatedOrderBook.Buy) {
    aggregatedOB.Buy[Number(price) / 100] =
      response.aggregatedOrderBook.Buy[price] / 100;
  }
  for (let price in response.aggregatedOrderBook.Sell) {
    aggregatedOB.Sell[Number(price) / 100] =
      response.aggregatedOrderBook.Sell[price] / 100;
  }
  const BuyOB = response.personalOrderBook.Buy.map((order: types.order) => {
    order.price *= 0.01;
    order.volume *= 0.01;
    return order;
  });
  const SellOB = response.personalOrderBook.Sell.map((order: types.order) => {
    order.price *= 0.01;
    order.volume *= 0.01;
    return order;
  });
  let personalOB: types.personalOB = { Buy: BuyOB, Sell: SellOB };
  let tradeHistory = response.tradeHistory.map((trade: types.trade) => {
    trade.price *= 0.01;
    trade.volume *= 0.01;
    return trade;
  });
  let userData = {
    GBP: response.userData.gbp / 10000,
    BTC: response.userData.btc / 100,
  };

  const newResponse: types.response = {
    personalOrderBook: personalOB,
    aggregatedOrderBook: aggregatedOB,
    tradeHistory: tradeHistory,
    userData: userData,
  };
  return newResponse;
}
