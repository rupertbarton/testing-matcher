import { select, call, put, takeEvery, all } from "redux-saga/effects";
import * as matcherActions from "src/reducer/matcherActions";
import * as userActions from "src/reducer/userActions";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import type * as types from "src/types";
import { selectMatcher, selectUser } from "../selectors";
import PersonalOrderBook from "src/parts/orderBooks/personalOB/PersonalOrderBook";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

function* addOrderAsync(action: types.action<types.order>) {
  const matcherState: types.matcherState = yield select(selectMatcher);
  const userState: types.userState = yield select(selectUser);

  const orderAction = action.payload.action;
  const price = action.payload.price;
  const volume = action.payload.volume;

  /*console.log("Here");
  console.log(action.payload);
  fetch("http://localhost:3001/user/" + userState.currentUser + "/order", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(action.payload),
  })
    .then(function (response) {
      console.log("Hello");
      console.log(response.text());
    })
    .then(function (data) {
      console.log(data);
    })
    .catch(function (error) {
      console.log("Request failed", error);
    });*/

  let aggregatedOrderBook: types.aggregatedOB = {
    Buy: { ...matcherState.aggregatedOrderBook.Buy },
    Sell: { ...matcherState.aggregatedOrderBook.Sell },
  };
  let personalOrderBook: types.personalOB = {
    Buy: [...matcherState.personalOrderBook.Buy],
    Sell: [...matcherState.personalOrderBook.Sell],
  };

  aggregatedOrderBook[orderAction][price] += volume;
  personalOrderBook[orderAction].push(action.payload);

  yield put(matcherActions.setAggregatedOrderBook(aggregatedOrderBook));
  yield put(matcherActions.setPersonalOrderBook(personalOrderBook));
}

export function* watchAddOrderAsync() {
  yield takeEvery("matcher/addOrder", addOrderAsync);
}

function* cancelOrderAsync(action: types.action<[types.orderAction, string]>) {
  const selectMatcher = (state: RootState): types.matcherState => state.matcher;
  const matcherState: types.matcherState = yield select(selectMatcher);

  const orderAction = action.payload[0];
  const orderId = action.payload[1];

  const order = matcherState.personalOrderBook[orderAction].find(
    (order) => order.id === orderId
  );
  const price = order!.price;
  const volume = order!.volume;

  let aggregatedOrderBook: types.aggregatedOB = {
    Buy: { ...matcherState.aggregatedOrderBook.Buy },
    Sell: { ...matcherState.aggregatedOrderBook.Sell },
  };
  let personalOrderBook = { ...matcherState.personalOrderBook };

  aggregatedOrderBook[orderAction][price] += -volume;

  const personalOrderBookAction = matcherState.personalOrderBook[
    orderAction
  ].filter((order) => order.id !== orderId);
  personalOrderBook[orderAction] = personalOrderBookAction;

  yield put(matcherActions.setAggregatedOrderBook(aggregatedOrderBook));
  yield put(matcherActions.setPersonalOrderBook(personalOrderBook));
}

export function* watchCancelOrderAsync() {
  yield takeEvery("matcher/cancelOrder", cancelOrderAsync);
}

export default function* rootSaga() {
  yield all([watchAddOrderAsync(), watchCancelOrderAsync()]);
  // code after all-effect
}
