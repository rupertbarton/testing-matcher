import { select, call, put, takeEvery, all } from "redux-saga/effects";
import * as matcherActions from "src/reducer/matcherActions";
import * as userActions from "src/reducer/userActions";
import * as settingsActions from "src/reducer/settingsActions";
import type * as types from "src/types";
import { selectMatcher, selectUser } from "../selectors";
import {
  fetchLogin,
  fetchPostOrder,
  fetchDeleteOrder,
  fetchDeleteAllOrders,
  fetchGetOrders,
  fetchGetAccount,
  fetchPutTopUp,
  fetchPutWithdraw,
} from "./apiRequests";
import AggregatedOrderBook from "src/parts/orderBooks/aggregatedOB/AggregatedOrderBook";
import { decodeResponse } from "./encoder-decoder";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

/*function* getMatcherInfo() {
  fetch("hhtp://localhost:3001/orders");
}*/

function* loginAsync(action: types.action<[string, string]>) {
  yield put(settingsActions.setCurrentError(""));
  try {
    const username = action.payload[0];
    const token: string = yield fetchLogin(username, action.payload[1]);
    yield put(userActions.setUser(username));
    yield put(userActions.setToken(token));
    console.log("token", token);
    const rawresponse: types.incomingresponse = yield fetchGetOrders(username);
    console.log(rawresponse);
    const response = decodeResponse(rawresponse);
    console.log("response: ", response);
    yield put(
      matcherActions.setAggregatedOrderBook(response.aggregatedOrderBook)
    );
    yield put(matcherActions.setPersonalOrderBook(response.personalOrderBook));
    yield put(userActions.setBalance(response.userData));
    yield put(matcherActions.setTradeHistory(response.tradeHistory));
  } catch (err) {
    console.log(err);
    yield put(settingsActions.setCurrentError((err as Error).message));
    return null;
  }
}

export function* watchLoginAsync() {
  yield takeEvery("user/login", loginAsync);
}

function* getOrdersAsync() {
  yield put(settingsActions.setCurrentError(""));
  try {
    const userState: types.userState = yield select(selectUser);
    const rawresponse: types.incomingresponse = yield fetchGetOrders(
      userState.currentUser
    );
    const response = decodeResponse(rawresponse);
    console.log(response);
    yield put(
      matcherActions.setAggregatedOrderBook(response.aggregatedOrderBook)
    );
    yield put(matcherActions.setPersonalOrderBook(response.personalOrderBook));
    yield put(userActions.setBalance(response.userData));
    yield put(matcherActions.setTradeHistory(response.tradeHistory));
  } catch (err) {
    console.log(err);
    yield put(settingsActions.setCurrentError((err as Error).message));
    return null;
  }
}

export function* watchGetOrdersAsync() {
  yield takeEvery("matcher/getMatcherInfo", getOrdersAsync);
}

function* setUserAsync(action: types.action<string>) {
  yield put(settingsActions.setCurrentError(""));
  try {
    const response: types.response = yield fetchGetAccount(action.payload);
    console.log(response);
    yield put(matcherActions.setPersonalOrderBook(response.personalOrderBook));
    yield put(userActions.setBalance(response.userData));
  } catch (err) {
    console.log(err);
    yield put(settingsActions.setCurrentError((err as Error).message));
    return null;
  }
}

export function* watchSetUserAsync() {
  yield takeEvery("user/setUser", setUserAsync);
}

function* addOrderAsync(action: types.action<types.order>) {
  yield put(settingsActions.setCurrentError(""));
  console.log("adding order");
  try {
    let order = action.payload;
    order.price *= 100;
    order.volume *= 100;
    const rawresponse: types.incomingresponse = yield fetchPostOrder(
      action.payload
    );
    const response = decodeResponse(rawresponse);
    yield put(
      matcherActions.setAggregatedOrderBook(response.aggregatedOrderBook)
    );
    yield put(matcherActions.setPersonalOrderBook(response.personalOrderBook));
    yield put(matcherActions.setTradeHistory(response.tradeHistory));
    yield put(userActions.setBalance(response.userData));
  } catch (err) {
    console.log(err);
    yield put(settingsActions.setCurrentError((err as Error).message));
    return null;
  }
}

export function* watchAddOrderAsync() {
  yield takeEvery("matcher/addOrder", addOrderAsync);
}

function* cancelOrderAsync(action: types.action<string>) {
  yield put(settingsActions.setCurrentError(""));
  try {
    const userState: types.userState = yield select(selectUser);
    const response: types.response = yield fetchDeleteOrder(
      userState.currentUser,
      action.payload
    );
    console.log("response:", response);
    yield put(
      matcherActions.setAggregatedOrderBook(response.aggregatedOrderBook)
    );
    yield put(matcherActions.setPersonalOrderBook(response.personalOrderBook));
    yield put(matcherActions.setTradeHistory(response.tradeHistory));
    yield put(userActions.setBalance(response.userData));
  } catch (err) {
    console.log(err);
    yield put(settingsActions.setCurrentError((err as Error).message));
    return null;
  }
}

export function* watchCancelOrderAsync() {
  yield takeEvery("matcher/cancelOrder", cancelOrderAsync);
}

function* cancelAllOrdersAsync() {
  yield put(settingsActions.setCurrentError(""));
  try {
    const userState: types.userState = yield select(selectUser);
    const response: types.response = yield fetchDeleteAllOrders(
      userState.currentUser
    );
    console.log("response:", response);
    yield put(
      matcherActions.setAggregatedOrderBook(response.aggregatedOrderBook)
    );
    yield put(matcherActions.setPersonalOrderBook(response.personalOrderBook));
    yield put(matcherActions.setTradeHistory(response.tradeHistory));
    yield put(userActions.setBalance(response.userData));
  } catch (err) {
    console.log(err);
    yield put(settingsActions.setCurrentError((err as Error).message));
    return null;
  }
}

export function* watchCancelAllOrdersAsync() {
  yield takeEvery("matcher/cancelAllOrders", cancelAllOrdersAsync);
}

function* topUpAsync(action: types.action<[types.currency, number]>) {
  yield put(settingsActions.setCurrentError(""));
  try {
    console.log(action.payload);
    const userState: types.userState = yield select(selectUser);
    const response: types.userData = yield fetchPutTopUp(
      userState.currentUser,
      action.payload[0],
      action.payload[1]
    );
    yield put(userActions.setBalance(response));
  } catch (err) {
    console.log(err);
    yield put(settingsActions.setCurrentError((err as Error).message));
    return null;
  }
}

export function* watchTopUpAsync() {
  yield takeEvery("user/topUp", topUpAsync);
}

function* withdrawAsync(action: types.action<[types.currency, number]>) {
  yield put(settingsActions.setCurrentError(""));
  try {
    console.log(action.payload);
    const userState: types.userState = yield select(selectUser);
    const response: types.userData = yield fetchPutWithdraw(
      userState.currentUser,
      action.payload[0],
      action.payload[1]
    );
    yield put(userActions.setBalance(response));
  } catch (err) {
    console.log(err);
    yield put(settingsActions.setCurrentError((err as Error).message));
    return null;
  }
}

export function* watchWithdrawAsync() {
  yield takeEvery("user/withdraw", withdrawAsync);
}

export default function* rootSaga() {
  yield all([
    watchLoginAsync(),
    watchAddOrderAsync(),
    watchCancelOrderAsync(),
    watchGetOrdersAsync(),
    watchCancelAllOrdersAsync(),
    //watchSetUserAsync(),
    watchTopUpAsync(),
    watchWithdrawAsync(),
  ]);
  // code after all-effect
}
