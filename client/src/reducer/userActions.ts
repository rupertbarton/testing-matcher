import {
  switchUserSocket,
  topUpSocket,
  withdrawSocket,
} from "src/app/sagas/sockets";
import type * as type from "../types";

export const setUser = (username: string, password: string = "password") => {
  switchUserSocket(username, password);
  return {
    type: "user/setUser",
    payload: username,
  };
};

export const setToken = (token: Number) => {
  return {
    type: "user/setToken",
    payload: token,
  };
};

export const topUp = (currency: type.currency, amount: number) => {
  topUpSocket(currency, amount);
  return {
    type: "user/topUp/deprecated",
    payload: [currency, amount],
  };
};

export const withdraw = (currency: type.currency, amount: number) => {
  withdrawSocket(currency, amount);
  return {
    type: "user/withdraw/deprecated",
    payload: [currency, amount],
  };
};

export const setBalance = (userData: type.userData) => {
  return {
    type: "user/setBalance",
    payload: userData,
  };
};
