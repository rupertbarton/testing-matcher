// import * as socketclient from "socket.io-client";
// import { useSelector, useDispatch } from "react-redux";
// import { store } from "../store";
// import { selectUser } from "../selectors";
// import * as matcherActions from "src/reducer/matcherActions";
// import * as userActions from "src/reducer/userActions";
// import * as settingsActions from "src/reducer/settingsActions";
// import type * as types from "src/types";
// import TradeHistory from "src/parts/tradeHistory/TradeHistory";

// const dispatch = store.dispatch;
// const userState = store.getState().user; //useSelector(selectUser);
// const currentUser = userState.currentUser;

// const socket = socketclient.connect("http://localhost:4000/");

// export const initialiseSocket = () => {
//   console.log("initialising");
//   socket.emit("initialise", currentUser);
// };

// export const switchUserSocket = (username: string, password: string) => {
//   dispatch(settingsActions.setCurrentError(""));
//   socket.emit("switchUser", { username, password });
// };

// export const deleteOrderSocket = (id: string) => {
//   dispatch(settingsActions.setCurrentError(""));
//   socket.emit("deleteOrder", id);
// };

// export const deleteAllOrderSocket = (username: string) => {
//   dispatch(settingsActions.setCurrentError(""));
//   socket.emit("deleteAllOrders", username);
// };

// export const addOrderSocket = (order: types.order) => {
//   console.log(JSON.stringify(order));
//   const javaOrder = {
//     username: order.username,
//     action: order.action,
//     volume: (order.volume * 100).toFixed(),
//     price: (order.price * 100).toFixed(),
//   };
//   dispatch(settingsActions.setCurrentError(""));
//   socket.emit("addOrder", javaOrder);
// };

// export const topUpSocket = (currency: types.currency, amount: number) => {
//   dispatch(settingsActions.setCurrentError(""));
//   socket.emit("topUp", JSON.stringify({ currency, amount }));
// };

// export const withdrawSocket = (currency: types.currency, amount: number) => {
//   dispatch(settingsActions.setCurrentError(""));
//   socket.emit("withdraw", JSON.stringify({ currency, amount }));
// };

// socket.on("aggregatedOB", (aggregatedOB: any) => {
//   //const aggregatedOB: types.aggregatedOB = JSON.parse(JSONstring);
//   let AggregatedOB: types.aggregatedOB = { Buy: {}, Sell: {} };
//   for (let price in aggregatedOB.buy) {
//     AggregatedOB.Buy[Number(price) / 100] =
//       Number(aggregatedOB.buy[price]) / 100;
//   }
//   for (let price in aggregatedOB.sell) {
//     AggregatedOB.Sell[Number(price) / 100] =
//       Number(aggregatedOB.sell[price]) / 100;
//   }
//   console.log(AggregatedOB);
//   dispatch(matcherActions.setAggregatedOrderBook(AggregatedOB));
// });

// socket.on("personalOB", (personalOB: any) => {
//   let PersonalOB: types.personalOB = {
//     Buy: personalOB.buy.map((o: types.order) => {
//       o.price *= 0.01;
//       o.volume *= 0.01;
//       return o;
//     }),
//     Sell: personalOB.sell.map((o: types.order) => {
//       o.price *= 0.01;
//       o.volume *= 0.01;
//       return o;
//     }),
//   };
//   console.log(PersonalOB);
//   //const personalOB: types.personalOB = JSON.parse(JSONstring);
//   dispatch(matcherActions.setPersonalOrderBook(PersonalOB));
// });

// socket.on(
//   "tradeHistory",
//   (packagedTradeHistory: types.packagedTradeHistory) => {
//     //const { tradeHistory }: types.packagedTradeHistory = packagedtradeHistory; // JSON.parse(JSONstring);
//     const tradeHistory = packagedTradeHistory.tradeHistory.map(
//       (t: types.trade) => {
//         t.price *= 0.01;
//         t.volume *= 0.01;
//         return t;
//       }
//     );
//     console.log(tradeHistory);
//     dispatch(matcherActions.setTradeHistory(tradeHistory));
//   }
// );

// socket.on("userData", (JSONstring: string) => {
//   const userData: types.userData = JSON.parse(JSONstring);
//   dispatch(userActions.setBalance(userData));
// });

// socket.on("userToken", (token: Number) => {
//   dispatch(userActions.setToken(token));
// });

// socket.on("error", (err: string) => {
//   //console.log(err);
//   dispatch(settingsActions.setCurrentError(err));
// });

export const afasf = () => {
  return "algn";
};
