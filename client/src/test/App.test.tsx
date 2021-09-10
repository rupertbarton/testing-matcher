import React from "react";
import { Store } from "redux";
import { Provider } from "react-redux";
import UserForm from "../parts/footer/userForm/UserForm";
import { screen } from "@testing-library/react";
import { render } from "./rtl-wrapper";
import ListItem from "../elements/listItem";
import OrderForm from "src/parts/footer/orderForm/OrderForm";
import userEvent from "@testing-library/user-event";

describe("UserForm", () => {
  test("UserForm DropDown loads correctly", async () => {
    render(
      <UserForm />
      //<Provider store={store}>
      //<App />
      //</Provider>
    );
    expect(screen.queryByText("GBP: 100")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("Andrea")).toBeInTheDocument();
    await userEvent.click(screen.getByDisplayValue("Andrea"));
    expect(screen.queryByText("Bob")).toBeInTheDocument();
  });

  test("UserForm TopUp resets amount", async () => {
    render(<UserForm />);
    const amountInput = screen.getByText("Amount:").closest("input");
    if (amountInput !== null) {
      await userEvent.type(amountInput, "10");
      expect(amountInput).toHaveValue("10");
      await userEvent.click(screen.getByText("Top Up"));
      expect(amountInput).toHaveValue("");
    }
  });
});

describe("OrderForm", () => {
  test("renders OrderForm", () => {
    render(<OrderForm />);
    expect(screen.queryByDisplayValue("Andrea")).toBeDisabled();
  });
});
