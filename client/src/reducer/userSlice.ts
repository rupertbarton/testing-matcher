import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type * as type from "../types";

const initialState: type.userState = {
  userList: ["Andrea", "Bob", "Catherine", "Doug", "Elliott"],
  currentUser: "Elliott",
  userBalance: { GBP: 50, BTC: 50 },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: type.action<string>) {
      state.currentUser = action.payload;
    },
    topUp(state, action: type.action<[type.currency, number]>) {
      state.userBalance[action.payload[0]] += action.payload[1];
    },
    withdraw(state, action: type.action<[type.currency, number]>) {
      state.userBalance[action.payload[0]] += -action.payload[1];
    },
  },
});

export const { setUser, topUp, withdraw } = userSlice.actions;

export default userSlice.reducer;
