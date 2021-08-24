import { select, call, put, takeEvery, all } from "redux-saga/effects";
import * as matcherActions from "src/reducer/matcherActions";
import * as userActions from "src/reducer/userActions";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import type * as types from "src/types";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

function* addOrderAsync(action: types.action<types.order>) {
  const selectMatcher = (state: RootState): types.matcherState => state.matcher;
  const matcherState: types.matcherState = yield select(selectMatcher);
  console.log(matcherState);

  const orderAction = action.payload.action;
  const price = action.payload.price;
  const volume = action.payload.volume;

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

export default function* watchAddOrderAsync() {
  yield takeEvery("matcher/addOrder", addOrderAsync);
}
