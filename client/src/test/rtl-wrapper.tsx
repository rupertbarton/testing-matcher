import * as React from "react";
import { render as rtlRender, RenderOptions } from "@testing-library/react";
import { Store } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import configureStore from "redux-mock-store";
import { RootState } from "../app/store";

interface ExtendedRenderOptions extends RenderOptions {
  initialState: Partial<RootState>;
  store?: Store<Partial<RootState>>;
}

const render = (
  component: React.ReactElement,
  {
    initialState,
    store = configureStore<Partial<RootState>>([thunk])(initialState),
    ...renderOptions
  }: ExtendedRenderOptions = {
    initialState: {
      matcher: {
        aggregatedOrderBook: { Buy: {}, Sell: {} },
        personalOrderBook: { Buy: [], Sell: [] },
        tradeHistory: [],
      },
      user: {
        userList: ["Andrea", "Bob"],
        currentUser: "Andrea",
        userBalance: { GBP: 100, BTC: 200 },
        currentToken: "no token",
      },
      settings: { currentObject: undefined, currentError: "", messages: [] },
    },
  }
) => {
  return rtlRender(component, {
    wrapper: TestWrapper(store),
    ...renderOptions,
  });
};

const TestWrapper =
  (store: Store) =>
  ({ children }: { children?: React.ReactNode }) =>
    <Provider store={store}>{children}</Provider>;

export * from "@testing-library/react";
// override the built-in render with our own
export { render };
