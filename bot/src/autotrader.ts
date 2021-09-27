import type * as types from "./types";
import React, { useState } from "react";
import {
  autotrader,
  fetchLogin,
  fetchPostOrder,
  marketPrice,
} from "./autotrader_util";

export function autotrade() {
  let oldMarketPrice = 5;
  let newMarketPrice = 5;
  let momentum = 0;
  const interval = setInterval(async function () {
    const token = await fetchLogin("admin", "password");
    const newOrder = await autotrader(newMarketPrice, momentum);
    console.log(newOrder);
    const response = await fetchPostOrder(token, newOrder);
    oldMarketPrice = newMarketPrice;
    newMarketPrice = marketPrice(response.aggregatedOrderBook);
    momentum = newMarketPrice - oldMarketPrice;
  }, 500);
  return interval;
}
