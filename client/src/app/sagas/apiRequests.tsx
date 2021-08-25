import type * as types from "src/types";

export async function fetchGetOrders(username: string) {
  return fetch("http://localhost:3001/user/" + username + "/orders", {}).then(
    async (response) => {
      if (response.status !== 200) {
        const err = await response.text();
        throw new Error(err);
      }
      return response.json();
    }
  );
}

export async function fetchGetAccount(username: string) {
  return fetch("http://localhost:3001/user/" + username, {}).then(
    async (response) => {
      if (response.status !== 200) {
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
  return fetch("http://localhost:3001/user/" + order.username + "/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  }).then(async (response) => {
    if (response.status !== 201) {
      const err = await response.text();
      throw new Error(err);
    }
    return response.json();
  });
}

export async function fetchDeleteOrder(
  username: string,
  orderId: string
): Promise<types.response> {
  return fetch(
    "http://localhost:3001/user/" + username + "/orders/" + orderId,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then(async (response) => {
    if (response.status !== 200) {
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
  return fetch("http://localhost:3001/user/" + username + "/orders/", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (response) => {
    if (response.status !== 200) {
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
  return fetch(
    "http://localhost:3001/user/" + username + "/deposit/" + currency,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    }
  ).then(async (response) => {
    if (response.status !== 200) {
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
    "http://localhost:3001/user/" + username + "/withdraw/" + currency,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    }
  ).then(async (response) => {
    if (response.status !== 200) {
      const err = await response.text();
      throw new Error(err);
    }
    console.log(response);
    return response.json();
  });
}
