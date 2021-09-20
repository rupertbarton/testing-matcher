import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type * as types from "../types";

const initialState: types.userState = {
  userList: ["Andrea", "Bob", "Catherine", "Doug", "Elliott"],
  currentUser: "Andrea",
  userBalance: { GBP: 0, BTC: 0 },
  currentToken: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: types.action<string>) {
      state.currentUser = action.payload;
    },
    setToken(state, action: types.action<Number>) {
      state.currentToken = action.payload;
    },
    setBalance(state, action: types.action<types.userData>) {
      state.userBalance = action.payload;
    },
  },
});

export const { setUser, setBalance } = userSlice.actions;

export default userSlice.reducer;
