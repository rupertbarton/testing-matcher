const Matcher = require("../app/matcher");

describe("Matcher", () => {
  let matcher;

  beforeEach(() => {
    matcher = new Matcher();
    let users = ["Andrea", "Bob", "Catherine", "Doug", "Elliott"];
    for (let username of users) {
      matcher.createAccount(username, 100000, 100000);
    }
  });

  /*it("fails this test", () => {
    expect(true).toBe(false);
  });*/

  test("Equal zero tolerance", () => {
    expect(matcher.equalZero(0.0000001)).toBe(true);
  });

  describe("Account features", () => {
    test("Add account", () => {
      matcher.throwErrors = true;
      expect(() => {
        matcher.createAccount("Andrea");
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
      matcher.throwErrors = true;
      matcher.withdraw("Andrea", 10, "GBP");
      expect(matcher.accountList.Andrea.GBP).toBe(100000 - 10);
      expect(() => {
        matcher.withdraw("Andrea", 100000, "GBP");
      }).toThrow("Transaction error: insufficient balance (GBP)");
    });
  });

  describe("Create and process an order", () => {
    test("Create a buy order", () => {
      let newOrder = matcher.createOrder("Andrea", matcher.buy, 1, 1);
      expect(newOrder.price).toBe(1);
    });

    test("Create a sell order", () => {
      let newOrder = matcher.createOrder("Andrea", matcher.sell, 1, 1);
      expect(newOrder.price).toBe(1);
    });

    test("Correctly processes first order", () => {
      let sellOrder = matcher.createOrder("Elliott", matcher.sell, 10, 5);
      newTrades = matcher.processOrder(sellOrder);
      expect(matcher.sellOrders[0]?.volume).toBe(10);
    });

    test("Two orders cancel out", () => {
      matcher.errorMessages = true;
      let buyOrder = matcher.createOrder("Elliott", matcher.buy, 50, 1);
      newTrades = matcher.processOrder(buyOrder);
      let sellOrder = matcher.createOrder("Andrea", matcher.sell, 50, 1);
      newTrades = matcher.processOrder(sellOrder);
      console.log(matcher.tradeHistory);
      expect(matcher.accountList.Elliott.BTC).toBe(100050);
    });

    test("Order validation", () => {
      matcher.throwErrors = true;
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
        matcher.createOrder("Andrea", matcher.buy, 5, true);
      }).toThrow("Price error: must be a number");
      expect(() => {
        matcher.createOrder("Andrea", matcher.sell, -5, 10);
      }).toThrow("Volume error: must be positive");
      expect(() => {
        matcher.createOrder("Andrea", matcher.buy, 5);
      }).toThrow("Price error: must be a number");
    });

    test("Create and sort sell order list", () => {
      createOrders(matcher, matcher.sell, 1);
      matcher.sortSellOrders();
      expect(matcher.sellOrders[3]?.price).toBe(20);
    });

    test("Create and sort buy order list", () => {
      createOrders(matcher, matcher.buy, 1);
      matcher.sortBuyOrders();
      expect(matcher.buyOrders[3]?.price).toBe(5);
    });

    test("Request and process cancelled order", () => {
      createOrders(matcher, matcher.sell, 1);
      let orderid = matcher.sellOrders[0].id;
      let user = matcher.sellOrders[0].username;
      matcher.cancelOrder(orderid);
      expect(matcher.accountList[user].BTC).toBe(100000);
      newOrder = matcher.createOrder("Bob", matcher.buy, 100, 0.1);
      newTrades = matcher.processOrder(newOrder);
      matcher.cancelOrder(newOrder.id);
      expect(matcher.accountList.Bob.GBP).toBe(100000);
      expect(matcher.buyOrders[0]).toBe(undefined);
    });

    test("Cancel and refund all orders", () => {
      user = "Andrea";
      for (let i = 0; i < 5; i++) {
        let buyOrder = matcher.createOrder("Andrea", matcher.buy, 100, 50);
        newTrades = matcher.processOrder(buyOrder);
        let sellOrder = matcher.createOrder("Andrea", matcher.sell, 100, 50);
        newTrades = matcher.processOrder(sellOrder);
      }
      expect(matcher.buyOrders.length).toBe(5);
      matcher.cancelAllOrders("Andrea");
      expect(matcher.buyOrders.length).toBe(0);
      expect(matcher.accountList.Andrea.GBP).toBe(100000);
    });

    test("Check balance before placing order", () => {
      matcher.throwErrors = true;
      matcher.createAccount("Frank", 10, 10);
      buyOrder = matcher.createOrder("Frank", matcher.buy, 5, 5);
      sellOrder = matcher.createOrder("Frank", matcher.sell, 20, 5);
      expect(() => {
        newTrades = matcher.processOrder(buyOrder);
      }).toThrow("Transaction error: insufficient balance (GBP)");
      expect(() => {
        newTrades = matcher.processOrder(sellOrder);
      }).toThrow("Transaction error: insufficient balance (BTC)");
    });

    test("Balance is correctly subtracted when placing order", () => {
      let newOrder = matcher.createOrder("Elliott", matcher.buy, 100, 5);
      newTrades = matcher.processOrder(newOrder);
      expect(matcher.accountList.Elliott.GBP).toBe(100000 - 500);
      newOrder = matcher.createOrder("Elliott", matcher.sell, 100, 5);
      newTrades = matcher.processOrder(newOrder);
      expect(matcher.accountList.Elliott.BTC).toBe(100000 - 100);
    });
  });

  describe("Match and make trades", () => {
    test("Correctly processes trade", () => {
      let sellOrder = matcher.createOrder("Andrea", matcher.sell, 10, 5);
      newTrades = matcher.processOrder(sellOrder);
      let buyOrder = matcher.createOrder("Elliott", matcher.buy, 10, 5);
      newTrades = matcher.processOrder(buyOrder);
      expect(matcher.tradeHistory[0]?.volume).toBe(10);
    });

    test("Generate a trade and push the remaining buy order to buyOrders", () => {
      createOrders(matcher, matcher.sell, 1);
      let buyOrder = matcher.createOrder("Elliott", matcher.buy, 10, 8);
      newTrades = matcher.processOrder(buyOrder);
      let totalTradeVolume = 0;
      for (trade of matcher.tradeHistory) {
        totalTradeVolume += trade.volume;
      }
      expect(matcher.buyOrders[0]?.volume + totalTradeVolume).toBe(10);
      //console.log(matcher.sellOrders);
      //console.log(matcher.buyOrders);
    });

    test("Generate a trade and push the remaining sell order to sellOrders", () => {
      createOrders(matcher, matcher.buy, 1);
      let sellOrder = matcher.createOrder("Elliott", matcher.sell, 23, 15);
      newTrades = matcher.processOrder(sellOrder);
      let totalTradeVolume = 0;
      for (trade of matcher.tradeHistory) {
        totalTradeVolume += trade.volume;
      }
      expect(matcher.sellOrders[0]?.volume + totalTradeVolume).toBe(23);
      //console.log(matcher.sellOrders);
      //console.log(matcher.buyOrders);
    });
  });

  describe("Consistency after many orders", () => {
    test("Handles large volume of sell orders, maintains correct sorting", () => {
      createOrders(matcher, matcher.sell, 2);
      expect(matcher.sellOrders[3]?.price).toBe(5);
    });

    test("Volume adds up", () => {
      createOrders(matcher, matcher.sell, 1);
      let buyOrder = matcher.createOrder("Elliott", matcher.buy, 100, 1);
      newTrades = matcher.processOrder(buyOrder);
      expect(
        matcher.buyOrders[0].volume + matcher.accountList.Elliott.BTC
      ).toBe(100100);
      expect(matcher.accountList.Elliott.GBP).toBe(99900);
    });

    test("Balances still add up after many orders", () => {
      let initialBalance = sumBalance(matcher, "GBP");
      createOrders(matcher, matcher.sell, 2);
      createOrders(matcher, matcher.buy, 2);
      let finalBalance = sumBalance(matcher, "GBP");
      expect(initialBalance).toBe(finalBalance);
    });

    test("Balances still add up after many non-integer orders", () => {
      //Will only display account balances to 4 decimal places, should avoid rounding errors
      //(unless people are trading large amounts)
      let initialBalance = sumBalance(matcher, "GBP");
      createOrders(matcher, matcher.sell, 3);
      createOrders(matcher, matcher.buy, 3);
      let finalBalance = sumBalance(matcher, "GBP");
      expect(finalBalance.toFixed(4)).toBe(initialBalance.toFixed(4));
    });

    test("Trading game", () => {
      balances = makeTrades(matcher);
      //console.log(matcher.accountList);
      expect(Math.abs(balances[1] - balances[0]) < 0.001).toBe(true);
    });
  });

  describe("Order books", () => {
    test("Personal order books", () => {
      createOrders(matcher, matcher.sell, 1);
      let privateBook = matcher.getPrivateBook("Andrea");
      expect(privateBook.Sell.length).toBe(1);
      expect(privateBook.Buy.length).toBe(0);
      createOrders(matcher, matcher.sell, 1);
      privateBook = matcher.getPrivateBook("Doug");
      expect(privateBook.Sell.length).toBe(2);
    });

    test("Create aggregated order book", () => {
      matcher.errorMessages = true;
      createOrders(matcher, matcher.sell, 1);
      console.log(matcher.aggregatedSellOrders);
      console.log(matcher.aggregatedBuyOrders);
      expect(matcher.aggregatedSellOrders[5]).toBe(7);
    });

    test("Update aggregated order book", () => {
      matcher.errorMessages = true;
      createOrders(matcher, matcher.sell, 1);
      createOrders(matcher, matcher.buy, 1);
    });
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
      newTrades = matcher.processOrder(newOrder);
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
      newTrades = matcher.processOrder(newOrder);
    }
  } else if (testcase == 3) {
    let accounts = ["Andrea", "Bob", "Catherine", "Doug", "Andrea", "Elliott"];
    let prices = [5, 0.01, 20.001, 10, 25];
    let volumes = [0.5, 10.00001, 150, 20.2];
    for (let i = 0; i < 150; i++) {
      let newOrder = matcher.createOrder(
        accounts[i % 6],
        action,
        volumes[i % 4],
        prices[i % 5]
      );
      newTrades = matcher.processOrder(newOrder);
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

function makeTrades(matcher) {
  let accounts = ["Andrea", "Bob", "Catherine", "Doug", "Elliott"];
  for (let i = 0; i < accounts.length; i++) {
    matcher.topUp(accounts[i], 50000 * i, "GBP");
  }
  let initialBalance = sumBalance(matcher, "GBP");
  let baseprice = [5, 4, 3, 2, 1];
  let volumes = [1000, 2000, 5000, 10000];
  for (let i = 0; i < 300; i++) {
    buyprice =
      (baseprice[i % 5] * matcher.accountList[accounts[i % 5]].GBP) /
      matcher.accountList[accounts[i % 5]].BTC;
    let buyOrder = matcher.createOrder(
      i % 5 === 4 ? "Frank" : accounts[i % 5],
      matcher.buy,
      volumes[i % 4],
      buyprice
    );
    newTrades = matcher.processOrder(buyOrder);
    let sellprice = baseprice[i % 5];
    let sellOrder = matcher.createOrder(
      accounts[i % 5],
      matcher.sell,
      volumes[i % 4],
      sellprice
    );
    newTrades = matcher.processOrder(sellOrder);
  }
  for (let user of accounts) {
    matcher.cancelAllOrders(user);
  }

  let finalBalance = sumBalance(matcher, "GBP");
  let balances = [initialBalance, finalBalance];
  return balances;
}
