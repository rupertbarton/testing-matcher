import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type * as types from "../types";

const initialState: types.matcherState = {
  aggregatedOrderBook: {
    Buy: {},
    Sell: {},
  },
  personalOrderBook: { Buy: [], Sell: [] },
  tradeHistory: [],
};

const matcherSlice = createSlice({
  name: "matcher",
  initialState,
  reducers: {
    setAggregatedOrderBook(state, action: types.action<types.aggregatedOB>) {
      state.aggregatedOrderBook = action.payload;
    },
    setPersonalOrderBook(state, action: types.action<types.personalOB>) {
      state.personalOrderBook = action.payload;
    },
    setTradeHistory(state, action: types.action<types.trade[]>) {
      state.tradeHistory = action.payload;
    },
  },
});

export const { setAggregatedOrderBook, setPersonalOrderBook, setTradeHistory } =
  matcherSlice.actions;

export default matcherSlice.reducer;
