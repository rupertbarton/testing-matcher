import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { store } from "../store";
import { selectUser } from "../selectors";
import * as matcherActions from "src/reducer/matcherActions";
import * as userActions from "src/reducer/userActions";
import * as settingsActions from "src/reducer/settingsActions";
import type * as types from "src/types";

const socket = io("http://localhost:3001");
const dispatch = store.dispatch;
const userState = store.getState().user; //useSelector(selectUser);
const currentUser = userState.currentUser;

export const initialiseSocket = () => {
  console.log("initialising");
  socket.emit("initialise", currentUser);
};

export const switchUserSocket = (username: string) => {
  dispatch(settingsActions.setCurrentError(""));
  socket.emit("switchUser", username);
};

export const deleteOrderSocket = (id: string) => {
  dispatch(settingsActions.setCurrentError(""));
  socket.emit("deleteOrder", id);
};

export const deleteAllOrderSocket = (username: string) => {
  dispatch(settingsActions.setCurrentError(""));
  socket.emit("deleteAllOrders", username);
};

export const addOrderSocket = (order: types.order) => {
  dispatch(settingsActions.setCurrentError(""));
  socket.emit("addOrder", JSON.stringify(order));
};

export const topUpSocket = (currency: types.currency, amount: number) => {
  dispatch(settingsActions.setCurrentError(""));
  socket.emit("topUp", JSON.stringify({ currency, amount }));
};

export const withdrawSocket = (currency: types.currency, amount: number) => {
  dispatch(settingsActions.setCurrentError(""));
  socket.emit("withdraw", JSON.stringify({ currency, amount }));
};

socket.on("aggregatedOB", (JSONstring) => {
  const aggregatedOB: types.aggregatedOB = JSON.parse(JSONstring);
  dispatch(matcherActions.setAggregatedOrderBook(aggregatedOB));
});

socket.on("personalOB", (JSONstring) => {
  const personalOB: types.personalOB = JSON.parse(JSONstring);
  dispatch(matcherActions.setPersonalOrderBook(personalOB));
});

socket.on("tradeHistory", (JSONstring) => {
  const { tradeHistory }: types.packagedTradeHistory = JSON.parse(JSONstring);
  dispatch(matcherActions.setTradeHistory(tradeHistory));
});

socket.on("userData", (JSONstring) => {
  const userData: types.userData = JSON.parse(JSONstring);
  dispatch(userActions.setBalance(userData));
});

socket.on("error", (err) => {
  //console.log(err);
  dispatch(settingsActions.setCurrentError(err));
});
