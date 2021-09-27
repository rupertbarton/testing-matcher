import { useSelector } from "react-redux";
import type * as types from "src/types";
import { selectUser } from "../selectors";
import { store } from "../store";
const port = 8080;

export async function fetchGetOrders(username: string) {
  const userState: types.userState = store.getState().user;
  return fetch("http://localhost:" + port + "/user/orders", {
    headers: { Authorization: userState.currentToken },
  }).then(async (response) => {
    if (response.status.toString()[0] !== "2") {
      const err = await response.text();
      throw new Error(err);
    }
    return response.json();
  });
}

// export async function fetchLogin(username: string, password: string) {
//   return fetch("http://localhost:" + port + "/user/" + username, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: password,
//   }).then(async (response) => {
//     if (response.status.toString()[0] !== "2") {
//       const err = await response.text();
//       throw new Error(err);
//     }
//     return response.json();
//   });
// }

export async function fetchLogin(username: string, password: string) {
  return fetch("http://localhost:" + port + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, password: password }),
  }).then(async (response) => {
    if (response.status.toString()[0] !== "2") {
      const err = await response.text();
      throw new Error(err);
    }
    return response.text();
  });
}

export async function fetchGetAccount(username: string) {
  return fetch("http://localhost:" + port + "/user/" + username, {}).then(
    async (response) => {
      if (response.status.toString()[0] !== "2") {
        const err = await response.text();
        throw new Error(err);
      }
      return response.json();
    }
  );
}

export async function fetchPostOrder(
  order: types.order
): Promise<types.response> {
  const userState: types.userState = store.getState().user;
  return fetch("http://localhost:" + port + "/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: userState.currentToken,
    },
    body: JSON.stringify(order),
  }).then(async (response) => {
    if (response.status.toString()[0] !== "2") {
      const err = await response.text();
      throw new Error(err);
    }
    console.log(response.json);
    return response.json();
  });
}

export async function fetchDeleteOrder(
  username: string,
  orderId: number
): Promise<types.response> {
  const userState: types.userState = store.getState().user;
  return fetch("http://localhost:" + port + "/order/" + orderId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: userState.currentToken,
    },
  }).then(async (response) => {
    if (response.status.toString()[0] !== "2") {
      const err = await response.text();
      throw new Error(err);
    }
    console.log(response);
    return response.json();
  });
}

export async function fetchDeleteAllOrders(
  username: string
): Promise<types.response> {
  return fetch("http://localhost:" + port + "/user/" + username + "/orders/", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (response) => {
    if (response.status.toString()[0] !== "2") {
      const err = await response.text();
      throw new Error(err);
    }
    console.log(response);
    return response.json();
  });
}

export async function fetchPutTopUp(
  username: string,
  currency: types.currency,
  amount: number
): Promise<types.response> {
  const userState: types.userState = store.getState().user;
  return fetch(
    "http://localhost:" + port + "/user/" + username + "/deposit/" + currency,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: userState.currentToken,
      },
      body: amount.toString(),
    }
  ).then(async (response) => {
    if (response.status.toString()[0] !== "2") {
      const err = await response.text();
      throw new Error(err);
    }
    console.log(response);
    return response.json();
  });
}

export async function fetchPutWithdraw(
  username: string,
  currency: types.currency,
  amount: number
): Promise<types.response> {
  return fetch(
    "http://localhost:" + port + "/user/" + username + "/withdraw/" + currency,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    }
  ).then(async (response) => {
    if (response.status.toString()[0] !== "2") {
      const err = await response.text();
      throw new Error(err);
    }
    console.log(response);
    return response.json();
  });
}
