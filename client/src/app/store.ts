import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import matcherReducer from "../reducer/matcherSlice";
import userReducer from "../reducer/userSlice";
import settingsReducer from "src/reducer/settingsSlice";
import rootSaga from "./sagas/sagas";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    matcher: matcherReducer,
    user: userReducer,
    settings: settingsReducer,
  },
  middleware: [...getDefaultMiddleware({ thunk: false }), sagaMiddleware],
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
