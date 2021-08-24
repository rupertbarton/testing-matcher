import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type * as types from "../types";

const initialState: types.matcherState = {
  aggregatedOrderBook: {
    Buy: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    Sell: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  },
  personalOrderBook: { Buy: [], Sell: [] },
  tradeHistory: [
    {
      buyer: "Elliott",
      seller: "Andrea",
      price: 5,
      volume: 10,
      timestamp: new Date(),
      id: "1a",
    },
  ],
};

/*export const addOrder = createAsyncThunk(
  "matcher/addOrder",
  async (order, thunkAPI) => {
    const matcherState = thunkAPI.getState();
  }
);*/

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
    getMatcherInfo(state, action: types.emptyAction) {
      //not needed until API implemented
    },
    /*cancelOrder(state, action: types.action<[types.orderAction, string]>) {
      // When API integrated, payload type is string
      state.personalOrderBook[action.payload[0]] = state.personalOrderBook[
        action.payload[0]
      ].filter((order) => order.id != action.payload[1]);
    },*/
    cancelAllOrders(state, action: types.action<string>) {
      // When API integrated, payload is username
      state.personalOrderBook.Buy = [];
      state.personalOrderBook.Sell = [];
    },
  },
});

export const {
  setAggregatedOrderBook,
  setPersonalOrderBook,
  setTradeHistory,
  getMatcherInfo,
  cancelAllOrders,
} = matcherSlice.actions;

export default matcherSlice.reducer;
