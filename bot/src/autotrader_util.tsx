import { io } from "socket.io-client";
import type * as types from "./types";
import React, { useState } from "react";

const port = 8080;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function fetchLogin(username: string, password: string) {
  return fetch("http://localhost:" + port + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, password: password }),
  }).then(async (response) => {
    if (response.status.toString()[0] !== "2") {
      const err = await response.text();
      throw new Error(err);
    }
    return response.text();
  });
}

export async function fetchPostOrder(
  token: string,
  order: types.order
): Promise<types.response> {
  return fetch("http://localhost:" + port + "/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(order),
  }).then(async (response) => {
    if (response.status.toString()[0] !== "2") {
      const err = await response.text();
      throw new Error(err);
    }
    console.log(response.json);
    return response.json();
  });
}

const accounts = ["Andrea", "Bob", "Catherine", "Doug"];
const actions = ["Buy", "Sell"];
let i = 0;
const secretValue = Math.random() * 5 + 2;

export const marketPrice = (aggregatedOB: types.aggregatedOB) => {
  let buyPrices = Object.keys(aggregatedOB.Buy);
  let sellPrices = Object.keys(aggregatedOB.Sell);
  buyPrices.sort((a, b) => Number(b) - Number(a));
  sellPrices.sort((a, b) => Number(a) - Number(b));
  return (Number(buyPrices[0] || 10) + Number(sellPrices[0] || 990)) / 200;
};

export const autotrader = async (marketPrice: number, momentum: number) => {
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
    volume: volume * 100,
    price: Math.round(price * 100),
  };
  //console.log(marketPrice);

  return order;
};
