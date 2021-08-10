function Matcher() {
  this.buy = "Buy";
  this.sell = "Sell";

  this.buyOrders = [];
  this.sellOrders = [];
  this.tradeHistory = [];
  this.accountList = {};

  //Account set up
  this.addAccount = function (username, startingGBP = 10, startingBTC = 0) {
    this.validateNewUsername(username);
    this.validateCurrencyAmount(startingGBP);
    this.validateCurrencyAmount(startingBTC);
    this.accountList[username] = {
      username,
      GBP: startingGBP,
      BTC: startingBTC,
    };
  };

  this.topUpGBP = function (username, amount) {
    this.validateExistingUsername;
    this.validateCurrencyAmount(amount);
    this.accountList[username].GBP += amount;
  };

  this.topUpBTC = function (username, amount) {
    this.validateExistingUsername;
    this.validateCurrencyAmount(amount);
    this.accountList[username].BTC += amount;
  };

  //Lots of validation checks
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

  this.validateCurrencyAmount = function (amount) {
    if (typeof amount !== "number") {
      throw new Error("Amount error: must be a number");
    }
    if (amount < 0) {
      throw new Error("Amount error: must be positive");
    } else {
      return true;
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
    if (volume <= 0) {
      throw new Error("Volume error: must be positive");
    } else {
      return true;
    }
  };

  this.validatePrice = function (price) {
    if (typeof price !== "number") {
      throw new Error("Price error: must be a number");
    }
    if (price <= 0) {
      throw new Error("Price error: must be positive");
    } else {
      return true;
    }
  };

  this.checkBalanceGBP = function (username, amount) {
    if (this.accountList[username].GBP < amount) {
      throw new Error("Transaction error: insufficient balance (GBP)");
    }
  };

  this.checkBalanceBTC = function (username, amount) {
    if (this.accountList[username].BTC < amount) {
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

  //main matcher functions
  this.createOrder = function (username, action, volume, price) {
    let order = {
      action,
      username,
      volume,
      price,
      timestamp: new Date(),
    };
    order["id"] = order.username + order.timestamp.toISOString();
    this.validateOrder(order);
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
    //If validateTrade fails, we're in trouble: we've already taken people's money but won't post the order
    this.validateTrade(newTrade);
    return newTrade;
  };

  this.creditAccounts = function (newTrade, buyOrder) {
    let amountPaid = newTrade.volume * newTrade.price;
    let priceDifference = buyOrder.price - newTrade.price;
    let refund = newTrade.volume * priceDifference;
    this.accountList[newTrade.seller].GBP += amountPaid;
    this.accountList[newTrade.buyer].GBP += refund;
    this.accountList[newTrade.buyer].BTC += newTrade.volume;
  };

  this.pushOrder = function (order) {
    this.validateOrder(order);
    if (order.action === this.buy) {
      this.buyOrders.push(order);
    } else if (order.action === this.sell) {
      this.sellOrders.push(order);
    }
  };

  this.sortBuyOrders = function () {
    this.buyOrders = this.buyOrders.filter((order) => order.volume > 0);
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
    this.sellOrders = this.sellOrders.filter((order) => order.volume > 0);
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
    this.sortSellOrders();
    for (let i = 0; i < this.sellOrders.length; i++) {
      if (newOrder.price < this.sellOrders[i].price) {
        break;
      }
      if (newOrder.username === this.sellOrders[i].username) {
        continue;
      }
      let newTrade = this.createTrade(newOrder, this.sellOrders[i]);
      this.tradeHistory.push(newTrade);
      this.creditAccounts(newTrade, newOrder);
      this.sellOrders[i].volume -= newTrade.volume;
      newOrder.volume -= newTrade.volume;
      if (newOrder.volume === 0) {
        break;
      }
    }
    if (newOrder.volume > 0) {
      this.pushOrder(newOrder);
      this.sortBuyOrders();
    }
    this.sortSellOrders();
  };

  this.processSell = function (newOrder) {
    this.sortBuyOrders();
    for (let i = 0; i < this.buyOrders.length; i++) {
      if (newOrder.price > this.buyOrders[i].price) {
        break;
      }
      if (newOrder.username === this.buyOrders[i].username) {
        continue;
      }
      let newTrade = this.createTrade(newOrder, this.buyOrders[i]);
      this.tradeHistory.push(newTrade);
      this.creditAccounts(newTrade, this.buyOrders[i]);
      this.buyOrders[i].volume -= newTrade.volume;
      newOrder.volume -= newTrade.volume;
      if (newOrder.volume === 0) {
        break;
      }
    }
    if (newOrder.volume > 0) {
      this.validateOrder(newOrder);
      this.pushOrder(newOrder);
      this.sortSellOrders();
    }
    this.sortBuyOrders();
  };

  this.processOrder = function (newOrder) {
    this.validateOrder(newOrder);
    if (newOrder.action === this.buy) {
      let amountGBP = newOrder.volume * newOrder.price;
      this.checkBalanceGBP(newOrder.username, amountGBP);
      this.accountList[newOrder.username].GBP -= amountGBP;
    } else if (newOrder.action === this.sell) {
      this.checkBalanceBTC(newOrder.username, newOrder.volume);
      this.accountList[newOrder.username].BTC -= newOrder.volume;
    }
    if (newOrder.action === this.buy) {
      this.processBuy(newOrder);
    } else if (newOrder.action === this.sell) {
      this.processSell(newOrder);
    }
  };
}

module.exports = Matcher;
