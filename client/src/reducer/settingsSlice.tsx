import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type * as types from "../types";

const initialState: types.settingsState = {
  currentObject: undefined,
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
  },
});

export const { setCurrentObject } = settingsSlice.actions;

export default settingsSlice.reducer;
