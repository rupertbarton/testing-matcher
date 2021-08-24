import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import matcherReducer from "../reducer/matcherSlice";
import userReducer from "../reducer/userSlice";
import rootSaga from "./sagas/matcherSagas";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    matcher: matcherReducer,
    user: userReducer,
  },
  middleware: [...getDefaultMiddleware({ thunk: false }), sagaMiddleware],
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
