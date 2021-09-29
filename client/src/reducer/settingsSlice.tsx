import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type * as types from "../types";

const initialState: types.settingsState = {
  currentObject: undefined,
  currentError: "",
  messages: [],
};

/*export const addOrder = createAsyncThunk(
  "matcher/addOrder",
  async (order, thunkAPI) => {
    const matcherState = thunkAPI.getState();
  }
);*/

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setCurrentObject(state, action: types.action<types.currentObject>) {
      state.currentObject = action.payload;
    },
    setCurrentError(state, action: types.action<string>) {
      state.currentError = action.payload;
    },
    addMessage(state, action: types.action<string>) {
      state.messages = [...state.messages, action.payload];
    },
    resetMessage(state, action: types.action<boolean>) {
      state.messages = [];
    },
  },
});

export const { setCurrentObject, setCurrentError } = settingsSlice.actions;

export default settingsSlice.reducer;
