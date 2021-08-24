import { RootState } from "./store";
import type * as types from "src/types";

export const selectUser = (state: RootState): types.userState => state.user;
export const selectMatcher = (state: RootState): types.matcherState =>
  state.matcher;
