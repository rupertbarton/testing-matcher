const Matcher = require("../app/matcher");

describe("Matcher", () => {
  let matcher;

  beforeEach(() => {
    matcher = new Matcher();
    let users = ["Andrea", "Bob", "Catherine", "Doug", "Elliott"];
    for (let username of users) {
      matcher.addAccount(username, 100000, 100000);
    }
  });

  /*it("fails this test", () => {
    expect(true).toBe(false);
  });*/

  test("Equal zero tolerance", () => {
    expect(matcher.equalZero(0.00001)).toBe(true);
  });

  test("Add account", () => {
    expect(() => {
      matcher.addAccount("Andrea");
    }).toThrow("Username error: account already exists");
  });

  test("Top up GBP", () => {
    matcher.topUp("Andrea", 10, "GBP");
    expect(matcher.accountList.Andrea.GBP).toBe(100010);
  });

  test("Top up BTC", () => {
    matcher.topUp("Andrea", 10, "BTC");
    expect(matcher.accountList.Andrea.BTC).toBe(100010);
  });

  test("Withdraw GBP", () => {
    matcher.withdraw("Andrea", 10, "GBP");
    expect(matcher.accountList.Andrea.GBP).toBe(100000 - 10);
    expect(() => {
      matcher.withdraw("Andrea", 100000, "GBP");
    }).toThrow("Transaction error: insufficient balance (GBP)");
  });

  test("Create an order", () => {
    let newOrder = matcher.createOrder("Andrea", matcher.buy, 1, 1);
    expect(newOrder.price).toBe(1);
  });

  test("Correctly processes first order", () => {
    let sellOrder = matcher.createOrder("Elliott", matcher.sell, 10, 5);
    matcher.processOrder(sellOrder);
    expect(matcher.sellOrders[0]?.volume).toBe(10);
  });

  test("Correctly processes trade", () => {
    let sellOrder = matcher.createOrder("Andrea", matcher.sell, 10, 5);
    matcher.processOrder(sellOrder);
    let buyOrder = matcher.createOrder("Elliott", matcher.buy, 10, 5);
    matcher.processOrder(buyOrder);
    expect(matcher.tradeHistory[0]?.volume).toBe(10);
  });

  test("Create and sort sell order list", () => {
    createOrders(matcher, matcher.sell, 1);
    matcher.sortSellOrders();
    expect(matcher.sellOrders[3]?.price).toBe(20);
  });

  test("Generate a trade and push the remaining buy order to buyOrders", () => {
    createOrders(matcher, matcher.sell, 1);
    let buyOrder = matcher.createOrder("Elliott", matcher.buy, 10, 8);
    matcher.processOrder(buyOrder);
    expect(matcher.buyOrders[0]?.volume).toBe(3);
    //console.log(matcher.sellOrders);
    //console.log(matcher.buyOrders);
  });

  test("Generate a trade and push the remaining sell order to sellOrders", () => {
    createOrders(matcher, matcher.buy, 1);
    let sellOrder = matcher.createOrder("Elliott", matcher.sell, 23, 15);
    matcher.processOrder(sellOrder);
    expect(matcher.sellOrders[0]?.volume).toBe(3);
    //console.log(matcher.sellOrders);
    //console.log(matcher.buyOrders);
  });

  test("Handles large volume of sell orders, maintains correct sorting", () => {
    createOrders(matcher, matcher.sell, 2);
    expect(matcher.sellOrders[3]?.price).toBe(5);
  });

  test("Volume adds up", () => {
    createOrders(matcher, matcher.sell, 1);
    let buyOrder = matcher.createOrder("Elliott", matcher.buy, 100, 50);
    matcher.processOrder(buyOrder);
    expect(matcher.buyOrders[0].volume).toBe(100 - 37);
  });

  test("Order validation", () => {
    expect(() => {
      matcher.createOrder("Zoe", matcher.sell, 5, 10);
    }).toThrow("Account error: account does not exist");
    expect(() => {
      matcher.createOrder("Andrea", "oopsie", 0.00001, 10);
    }).toThrow("Action error: must be Buy or Sell");
    expect(() => {
      matcher.createOrder("Andrea", matcher.buy, "Bob", 10);
    }).toThrow("Volume error: must be a number");
    expect(() => {
      matcher.createOrder("Andrea", matcher.buy, -5, 10);
    }).toThrow("Volume error: must be positive");
    expect(() => {
      matcher.createOrder("Andrea", matcher.buy, 5, true);
    }).toThrow("Price error: must be a number");
    expect(() => {
      matcher.createOrder("Andrea", matcher.buy, 5, 0);
    }).toThrow("Price error: must be positive");
  });

  test("Check balance before placing order", () => {
    matcher.addAccount("Frank", 10, 10);
    buyOrder = matcher.createOrder("Frank", matcher.buy, 5, 5);
    sellOrder = matcher.createOrder("Frank", matcher.sell, 20, 5);
    expect(() => {
      matcher.processOrder(buyOrder);
    }).toThrow("Transaction error: insufficient balance (GBP)");
    expect(() => {
      matcher.processOrder(sellOrder);
    }).toThrow("Transaction error: insufficient balance (BTC)");
  });

  test("Balance is correctly subtracted when placing order", () => {
    let newOrder = matcher.createOrder("Elliott", matcher.buy, 100, 5);
    matcher.processOrder(newOrder);
    expect(matcher.accountList.Elliott.GBP).toBe(100000 - 500);
    newOrder = matcher.createOrder("Elliott", matcher.sell, 100, 5);
    matcher.processOrder(newOrder);
    expect(matcher.accountList.Elliott.BTC).toBe(100000 - 100);
  });

  test("Balances still add up after many orders", () => {
    let initialBalance = sumBalance(matcher, "GBP");
    createOrders(matcher, matcher.sell, 2);
    createOrders(matcher, matcher.buy, 2);
    let finalBalance = sumBalance(matcher, "GBP");
    expect(initialBalance).toBe(finalBalance);
  });

  test("Balances still add up after many non-integer orders", () => {
    //Currently doesn't work, we get rounding errors.
    //This could lead to additional, tiny trades going through.
    let initialBalance = sumBalance(matcher, "GBP");
    createOrders(matcher, matcher.sell, 3);
    createOrders(matcher, matcher.buy, 3);
    console.log(matcher.tradeHistory.length);
    let finalBalance = sumBalance(matcher, "GBP");
    expect(finalBalance).toBe(initialBalance);
  });
});

function createOrders(matcher, action, testcase = 1) {
  if (testcase == 1) {
    let accounts = ["Andrea", "Bob", "Catherine", "Doug"];
    let prices = [20, 5, 10, 5];
    let volumes = [20, 5, 10, 2];
    for (let i = 0; i < accounts.length; i++) {
      let newOrder = matcher.createOrder(
        accounts[i],
        action,
        volumes[i],
        prices[i]
      );
      matcher.processOrder(newOrder);
    }
  } else if (testcase == 2) {
    let accounts = ["Andrea", "Bob", "Catherine", "Doug"];
    let prices = [5, 10, 15, 20, 25];
    let volumes = [5, 10, 15, 20];
    for (let i = 0; i < 50; i++) {
      let newOrder = matcher.createOrder(
        accounts[i % 4],
        action,
        volumes[i % 4],
        prices[i % 5]
      );
      matcher.processOrder(newOrder);
    }
  } else if (testcase == 3) {
    let accounts = ["Andrea", "Bob", "Catherine", "Doug", "Andrea", "Elliott"];
    let prices = [5, 0.1, 20.001, 10, 25];
    let volumes = [0.5, 10.00001, 150, 20.2];
    for (let i = 0; i < 150; i++) {
      let newOrder = matcher.createOrder(
        accounts[i % 6],
        action,
        volumes[i % 4],
        prices[i % 5]
      );
      matcher.processOrder(newOrder);
    }
  }
}

function sumBalance(matcher, currency) {
  let accountTotal = 0;
  for (username in matcher.accountList) {
    accountTotal += matcher.accountList[username][currency];
  }
  if (currency === "GBP") {
    for (i = 0; i < matcher.buyOrders.length; i++) {
      let orderValue = matcher.buyOrders[i].volume * matcher.buyOrders[i].price;
      accountTotal += orderValue;
    }
  } else if (currency === "BTC") {
    for (i = 0; i < matcher.sellOrders.length; i++) {
      accountTotal += matcher.sellOrders[i].volume;
    }
  }
  return accountTotal;
}
