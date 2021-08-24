import type * as type from "../types";

export const setUser = (username: string) => {
  return {
    type: "user/setUser",
    payload: username,
  };
};

export const topUp = (currency: type.currency, amount: number) => {
  return {
    type: "user/topUp",
    payload: [currency, amount],
  };
};

export const withdraw = (currency: type.currency, amount: number) => {
  return {
    type: "user/withdraw",
    payload: [currency, amount],
  };
};
