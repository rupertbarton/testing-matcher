function Matcher() {
  //add const file?
  this.buy = "Buy";
  this.sell = "Sell";

  this.throwErrors = false;
  this.errorMessages = false;

  this.buyOrders = [];
  this.sellOrders = [];
  this.tradeHistory = [];
  this.accountList = {};

  this.aggregatedBuyOrders = {};
  this.aggregatedSellOrders = {};

  // Utilities
  this.round = function (value) {
    let decimalPlaces = 6;
    value *= 10 ** decimalPlaces;
    rounded = Math.round(value);
    return rounded / 10 ** decimalPlaces;
  };

  this.announceError = function (err) {
    //How should I inform someone about the error message?
    if (this.errorMessages === true) {
      console.log(
        "The trading system has encountered a problem and has had to close.\n\
    If you were in the middle of a trade, and remaining value in your order will have been refunded.\n\
    Error message follows:"
      );
      console.log(err);
    }
    if (this.throwErrors) {
      throw new Error(err);
    }
  };

  this.equalZero = function (value) {
    tolerance = 1e-6;
    if (typeof value != "number") {
      throw new Error("Type error: only a number can be <= 0");
    } else {
      return Math.abs(value) < tolerance;
    }
  };

  this.lessthanequalZero = function (value) {
    tolerance = 1e-6;
    if (typeof value != "number") {
      throw new Error("Type error: only a number can be <= 0");
    } else {
      return value < tolerance;
    }
  };

  this.lessthanZero = function (value) {
    tolerance = -1e-6;
    if (typeof value != "number") {
      throw new Error("Type error: only a number can be <= 0");
    } else {
      return value < tolerance;
    }
  };

  this.roundBalance = function (username) {
    try {
      this.validateExistingUsername(username);
    } catch (err) {
      this.announceError(err);
      return undefined;
    }
    this.accountList[username].GBP = this.round(this.accountList[username].GBP);
    this.accountList[username].BTC = this.round(this.accountList[username].BTC);
  };

  // Account actions
  this.createAccount = function (username, startingGBP = 10, startingBTC = 0) {
    try {
      this.validateNewUsername(username);
      this.validateStartingAmount(startingGBP);
      this.validateStartingAmount(startingBTC);
    } catch (err) {
      this.announceError(err);
      return undefined;
    }
    this.accountList[username] = {
      GBP: this.round(startingGBP),
      BTC: this.round(startingBTC),
    };
  };

  this.topUp = function (username, amount, currency) {
    try {
      this.validateExistingUsername(username);
      this.validateCurrencyAmount(amount);
      this.validateCurrency(currency);
    } catch (err) {
      this.announceError(err);
      return undefined;
    }
    this.accountList[username][currency] += this.round(amount);
  };

  this.withdraw = function (username, amount, currency) {
    try {
      this.validateExistingUsername(username);
      this.validateCurrencyAmount(amount);
      this.validateCurrency(currency);
    } catch (err) {
      this.announceError(err);
      return undefined;
    }
    if (currency === "GBP") {
      try {
        this.checkBalanceGBP(username, amount);
      } catch (err) {
        this.announceError(err);
        return undefined;
      }
      this.accountList[username][currency] -= this.round(amount);
    } else if (currency === "BTC") {
      try {
        this.checkBalanceBTC(username, amount);
      } catch (err) {
        this.announceError(err);
        return undefined;
      }
      this.accountList[username][currency] -= this.round(amount);
    }
  };

  this.cancelOrder = function (id) {
    let action;
    try {
      action = this.validateExistingOrderId(id);
    } catch (err) {
      this.announceError(err);
      return undefined;
    }
    if (action === this.buy) {
      orderIndex = this.buyOrders.findIndex((order) => order.id === id);
      this.refundOrder(this.buyOrders[orderIndex]);
      this.buyOrders.splice(orderIndex, 1);
    } else if (action === this.sell) {
      orderIndex = this.sellOrders.findIndex((order) => order.id === id);
      this.refundOrder(this.sellOrders[orderIndex]);
      this.sellOrders.splice(orderIndex, 1);
    }
  };

  this.cancelAllOrders = function (username) {
    try {
      this.validateExistingUsername(username);
    } catch (err) {
      this.announceError(err);
      return undefined;
    }
    myBuyOrders = this.buyOrders.filter((order) => order.username === username);
    mySellOrders = this.sellOrders.filter(
      (order) => order.username === username
    );
    for (let order of myBuyOrders) {
      this.cancelOrder(order.id);
    }
    for (let order of mySellOrders) {
      this.cancelOrder(order.id);
    }
  };

  this.getPrivateOrders = function (username, action) {
    try {
      this.validateExistingUsername(username);
      this.validateAction(action);
    } catch (err) {
      this.announceError(err);
      return undefined;
    }
    if (action === this.buy) {
      return this.buyOrders.filter((order) => order.username === username);
    } else if (action === this.sell) {
      return this.sellOrders.filter((order) => order.username === username);
    }
  };

  this.getPrivateBook = function (username) {
    try {
      this.validateExistingUsername;
      let Buy = this.getPrivateOrders(username, this.buy);
      let Sell = this.getPrivateOrders(username, this.sell);
      let privateOrderBook = { Buy, Sell };
      return privateOrderBook;
    } catch (err) {
      this.announceError(err);
      return undefined;
    }
  };

  this.updateOrderBook = function () {
    this.aggregatedBuyOrders = {};
    prices = this.buyOrders.map((order) => order.price);
    for (let price of prices) {
      ordersAtPrice = this.buyOrders.filter((order) => order.price === price);
      let aggregatedVolume = 0;
      for (let order of ordersAtPrice) {
        aggregatedVolume += order.volume;
      }
      this.aggregatedBuyOrders[price] = aggregatedVolume;
    }
    this.aggregatedSellOrders = {};
    prices = this.sellOrders.map((order) => order.price);
    for (let price of prices) {
      ordersAtPrice = this.sellOrders.filter((order) => order.price === price);
      let aggregatedVolume = 0;
      for (let order of ordersAtPrice) {
        aggregatedVolume += order.volume;
      }
      this.aggregatedSellOrders[price] = aggregatedVolume;
    }
  };

  // Lots of validation checks
  this.validateNewUsername = function (username) {
    if (username in this.accountList) {
      throw new Error("Username error: account already exists");
    } else if (typeof username !== "string") {
      throw new Error("Username error: must be string");
    } else if (username === "") {
      throw new Error("Username error: username field must not be empty");
    } else if (username.length > 15) {
      throw new Error("Username error: maximum length 15 characters");
    }
  };

  this.validateStartingAmount = function (amount) {
    //Starting currency amount CAN be exactly zero
    if (typeof amount !== "number") {
      throw new Error("Amount error: must be a number");
    }
    if (amount < 0) {
      throw new Error("Amount error: must be positive");
    } else {
      return true;
    }
  };

  this.validateCurrencyAmount = function (amount) {
    if (typeof amount !== "number") {
      throw new Error("Amount error: must be a number");
    }
    if (this.lessthanequalZero(amount)) {
      throw new Error("Amount error: must be positive");
    } else {
      return true;
    }
  };

  this.validateCurrency = function (currency) {
    if (currency !== "GBP" && currency !== "BTC") {
      throw new Error("Error: invalid currency (use GBP or BTC)");
    }
  };

  this.validateExistingUsername = function (username) {
    let valid = username in this.accountList;

    if (valid === false) {
      throw new Error("Account error: account does not exist");
    } else {
      return true;
    }
  };

  this.validateExistingOrderId = function (id) {
    let action =
      this.buyOrders.find((order) => order.id === id) != undefined
        ? this.buy
        : this.sellOrders.find((order) => order.id === id) != undefined
        ? this.sell
        : false;
    if (typeof id !== "string") {
      throw new Error("Order error: invalid order id (must be string)");
    } else if (action === false) {
      throw new Error("Order error: no active order with that id");
    } else {
      return action;
    }
  };

  this.validateAction = function (action) {
    if (action !== this.buy && action !== this.sell) {
      throw new Error("Action error: must be Buy or Sell");
    } else {
      return true;
    }
  };

  this.validateVolume = function (volume) {
    if (typeof volume !== "number") {
      throw new Error("Volume error: must be a number");
    }
    if (this.lessthanequalZero(volume)) {
      throw new Error("Volume error: must be positive");
    } else {
      return true;
    }
  };

  this.validatePrice = function (price) {
    if (typeof price !== "number") {
      throw new Error("Price error: must be a number");
    }
    if (this.lessthanequalZero(price)) {
      throw new Error("Price error: must be positive");
    } else {
      return true;
    }
  };

  this.checkBalanceGBP = function (username, amount) {
    if (this.lessthanZero(this.accountList[username].GBP - amount)) {
      throw new Error("Transaction error: insufficient balance (GBP)");
    }
  };

  this.checkBalanceBTC = function (username, amount) {
    if (this.lessthanZero(this.accountList[username].BTC - amount)) {
      throw new Error("Transaction error: insufficient balance (BTC)");
    }
  };

  this.validateOrder = function (order) {
    this.validateExistingUsername(order.username);
    this.validateAction(order.action);
    this.validateVolume(order.volume);
    this.validatePrice(order.price);
  };

  this.validateTrade = function (trade) {
    this.validateExistingUsername(trade.buyer);
    this.validateExistingUsername(trade.seller);
    this.validateVolume(trade.volume);
    this.validatePrice(trade.price);
    if (trade.buyer === trade.seller) {
      throw new Error("Error: cannot trade with yourself");
    }
  };

  // Main matcher functions
  this.createOrder = function (username, action, volume, price) {
    let order = {
      action,
      username,
      volume,
      price,
      timestamp: new Date(),
    };
    order["id"] = order.username + order.timestamp.toISOString();
    try {
      this.validateOrder(order);
    } catch (err) {
      this.announceError(err);
      return undefined;
    }
    return order;
  };

  this.createTrade = function (buyOrder, sellOrder) {
    let buyVolume = buyOrder.volume;
    let sellVolume = sellOrder.volume;
    let volume = buyVolume <= sellVolume ? buyVolume : sellVolume;

    let newTrade = {
      buyer: buyOrder.username,
      seller: sellOrder.username,
      volume,
      price: sellOrder.price,
      timestamp: new Date(),
      id: buyOrder.id + sellOrder.id,
    };
    /*//Manually break a trade, nobody should lose GBP or BTC
    if (newTrade.buyer === "Elliott" && newTrade.seller === "Bob") {
      newTrade.seller = "Elliott";
    }*/
    try {
      this.validateTrade(newTrade);
    } catch (err) {
      this.announceError(err);
      return undefined;
    }
    return newTrade;
  };

  this.creditAccounts = function (newTrade, buyOrder) {
    let amountPaid = newTrade.volume * newTrade.price;
    let priceDifference = buyOrder.price - newTrade.price;
    let refund = newTrade.volume * priceDifference;
    this.accountList[newTrade.seller].GBP += this.round(amountPaid);
    this.accountList[newTrade.buyer].GBP += this.round(refund);
    this.accountList[newTrade.buyer].BTC += this.round(newTrade.volume);
    this.roundBalance(newTrade.seller);
    this.roundBalance(newTrade.buyer);
  };

  this.refundOrder = function (order) {
    if (order.action === this.buy) {
      orderValue = order.volume * order.price;
      this.accountList[order.username].GBP += orderValue;
    } else if (order.action === this.sell) {
      this.accountList[order.username].BTC += order.volume;
    }
    this.roundBalance(order.username);
  };

  this.pushOrder = function (order) {
    try {
      this.validateOrder(order);
    } catch (err) {
      this.announceError(err);
      return undefined;
    }
    if (order.action === this.buy) {
      this.buyOrders.push(order);
    } else if (order.action === this.sell) {
      this.sellOrders.push(order);
    }
  };

  this.sortBuyOrders = function () {
    this.buyOrders = this.buyOrders.filter(
      (order) => this.lessthanequalZero(order.volume) === false
    );
    this.buyOrders.sort(function (order1, order2) {
      let pricediff = order2.price - order1.price;
      if (pricediff !== 0) {
        return pricediff;
      } else {
        let timediff = order1.timestamp - order2.timestamp;
        return timediff;
      }
    });
  };

  this.sortSellOrders = function () {
    this.sellOrders = this.sellOrders.filter(
      (order) => this.lessthanequalZero(order.volume) === false
    );
    this.sellOrders.sort(function (order1, order2) {
      let pricediff = order1.price - order2.price;
      if (pricediff !== 0) {
        return pricediff;
      } else {
        let timediff = order1.timestamp - order2.timestamp;
        return timediff;
      }
    });
  };

  this.processBuy = function (newOrder) {
    let newTrades = [];
    this.sortSellOrders();
    for (let i = 0; i < this.sellOrders.length; i++) {
      if (this.lessthanZero(newOrder.price - this.sellOrders[i].price)) {
        break;
      }
      if (newOrder.username === this.sellOrders[i].username) {
        continue;
      }
      try {
        let newTrade = this.createTrade(newOrder, this.sellOrders[i]);
        newTrades.push(newTrade);
        this.tradeHistory.push(newTrade);
        this.creditAccounts(newTrade, newOrder);
        this.sellOrders[i].volume -= newTrade.volume;
        newOrder.volume -= newTrade.volume;
      } catch (err) {
        this.announceError(err);
        continue;
      }

      if (this.equalZero(newOrder.volume)) {
        break;
      }
    }
    if (this.equalZero(newOrder.volume) === false) {
      try {
        this.pushOrder(newOrder);
      } catch (err) {
        this.refundOrder(newOrder);
        this.announceError(err);
      }
    }
    this.sortSellOrders();
    return newTrades;
  };

  this.processSell = function (newOrder) {
    let newTrades = [];
    this.sortBuyOrders();
    for (let i = 0; i < this.buyOrders.length; i++) {
      if (this.lessthanZero(this.buyOrders[i].price - newOrder.price)) {
        break;
      }
      if (newOrder.username === this.buyOrders[i].username) {
        continue;
      }
      try {
        let newTrade = this.createTrade(this.buyOrders[i], newOrder);
        newTrades.push(newTrade);
        this.tradeHistory.push(newTrade);
        this.creditAccounts(newTrade, this.buyOrders[i]);
        this.buyOrders[i].volume -= newTrade.volume;
        newOrder.volume -= newTrade.volume;
      } catch (err) {
        this.announceError(err);
        continue;
      }

      if (this.equalZero(newOrder.volume)) {
        break;
      }
    }
    if (this.equalZero(newOrder.volume) === false) {
      try {
        this.pushOrder(newOrder);
      } catch (err) {
        this.refundOrder(newOrder);
        this.announceError(err);
      }
      this.sortSellOrders();
    }
    this.sortBuyOrders();
    return newTrades;
  };

  this.processOrder = function (newOrder) {
    try {
      this.validateOrder(newOrder);
    } catch (err) {
      this.announceError(err);
      return false;
    }
    if (newOrder.action === this.buy) {
      let amountGBP = newOrder.volume * newOrder.price;
      try {
        this.checkBalanceGBP(newOrder.username, amountGBP);
      } catch (err) {
        this.announceError(err);
        return undefined;
      }
      this.accountList[newOrder.username].GBP -= amountGBP;
      this.roundBalance(newOrder.username);
    } else if (newOrder.action === this.sell) {
      try {
        this.checkBalanceBTC(newOrder.username, newOrder.volume);
      } catch (err) {
        this.announceError(err);
        return undefined;
      }
      this.accountList[newOrder.username].BTC -= newOrder.volume;
    }
    if (newOrder.action === this.buy) {
      newTrades = this.processBuy(newOrder);
    } else if (newOrder.action === this.sell) {
      newTrades = this.processSell(newOrder);
    }
    this.updateOrderBook();
    return newTrades;
  };
}

module.exports = Matcher;
