import { select, call, put, takeEvery, all } from "redux-saga/effects";
import * as matcherActions from "src/reducer/matcherActions";
import * as userActions from "src/reducer/userActions";
import * as settingsActions from "src/reducer/settingsActions";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import type * as types from "src/types";
import { selectMatcher, selectUser } from "../selectors";
import PersonalOrderBook from "src/parts/orderBooks/personalOB/PersonalOrderBook";
import OrderBooks from "src/parts/orderBooks/OrderBooks";
import {
  fetchPostOrder,
  fetchDeleteOrder,
  fetchDeleteAllOrders,
  fetchGetOrders,
  fetchGetAccount,
  fetchPutTopUp,
  fetchPutWithdraw,
} from "./apiRequests";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

/*function* getMatcherInfo() {
  fetch("hhtp://localhost:3001/orders");
}*/

function* getOrdersAsync() {
  yield put(settingsActions.setCurrentError(""));
  try {
    const userState: types.userState = yield select(selectUser);
    const response: types.response = yield fetchGetOrders(
      userState.currentUser
    );
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
  try {
    const response: types.response = yield fetchPostOrder(action.payload);
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
    watchAddOrderAsync(),
    watchCancelOrderAsync(),
    watchGetOrdersAsync(),
    watchCancelAllOrdersAsync(),
    watchSetUserAsync(),
    watchTopUpAsync(),
    watchWithdrawAsync(),
  ]);
  // code after all-effect
}
