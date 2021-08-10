const Matcher = require("../app/matcher");

describe("Matcher", () => {
  let matcher;

  beforeEach(() => {
    matcher = new Matcher();
    users = ["Andrea", "Bob", "Catherine", "Doug", "Elliott"];
    for (let username of users) {
      matcher.addAccount(username);
    }
  });

  /*it("fails this test", () => {
    expect(true).toBe(false);
  });*/

  test("Add account", () => {
    expect(() => {
      matcher.addAccount("Andrea");
    }).toThrow("Username error: account already exists");
  });

  test("Top up GBP", () => {
    matcher.topUpGBP("Andrea", 10);
    expect(matcher.accountList[0].GBP).toBe(20);
  });

  test("action inverter", () => {
    let inverse = matcher.inverse("Sell");
    expect(inverse).toBe("Buy");
  });

  test("Create an order", () => {
    let newOrder = matcher.createOrder("Andrea", matcher.buy, 1, 1);
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

  test("Correctly processes first order", () => {
    let sellOrder = matcher.createOrder("Andrea", matcher.sell, 10, 5);
    matcher.processOrder(sellOrder);
    expect(matcher.sellOrders[0]?.volume).toBe(10);
  });

  test("Correctly processes trade", () => {
    let sellOrder = matcher.createOrder("Andrea", matcher.sell, 10, 5);
    matcher.processOrder(sellOrder);
    let buyOrder = matcher.createOrder("Elliott", matcher.buy, 10, 5);
    matcher.processOrder(buyOrder);
    expect(matcher.pastTrades[0]?.volume).toBe(10);
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
      matcher.createOrder("Andrea", "oopsie", 5, 10);
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
  }
}
