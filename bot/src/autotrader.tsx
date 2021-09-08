import { io } from "socket.io-client";
import type * as types from "./types";
import React, { useState } from "react";

const socket = io("http://localhost:3001");

const accounts = ["Andrea", "Bob", "Catherine", "Doug"];
const actions = ["Buy", "Sell"];
let i = 0;
const secretValue = Math.random() * 5 + 2;

export const submitTrade = (order: types.order) => {
  socket.emit("addOrderBot", JSON.stringify(order));
};

socket.on("botResponse", (JSONstring) => {
  const { oldMarketPrice, newMarketPrice } = JSON.parse(JSONstring);
  const momentum = newMarketPrice - oldMarketPrice;
  console.log(newMarketPrice);
  autotrader(newMarketPrice, momentum);
});

export const autotrader = (marketPrice: number, momentum: number) => {
  const volatility = Math.floor(Math.random() * 200);
  let price = marketPrice; // +    Math.floor(Math.random() * volatility) / 100 -    volatility / 200;
  if (price < 0.5) {
    price = 0.5;
  }
  let sellPressure = momentum < 0 ? 0.85 : momentum > 0 ? 0.15 : 0.5; //= marketPrice / 10;
  sellPressure += (marketPrice - 5) / 20;
  const volume = 1 + Math.floor(Math.random() * 20);
  const action = Math.random() < sellPressure ? "Sell" : "Buy";
  price += action === "Buy" ? 0.1 : -0.1;
  const username = accounts[Math.floor(Math.random() * 4)];

  const order = {
    username,
    action,
    volume,
    price: Math.round(price * 100) / 100,
  };
  console.log(marketPrice);
  console.log(order);
  console.log(secretValue);
  //console.log(marketPrice);

  setTimeout(submitTrade, 200, order);
};
