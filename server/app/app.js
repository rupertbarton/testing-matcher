var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const Matcher = require("./matcher");

let matcher = new Matcher();

matcher.createAccount("Andrea", 100, 100);
matcher.createAccount("Bob", 100, 100);
matcher.createAccount("Catherine", 100, 100);
matcher.createAccount("Doug", 100, 100);
matcher.createAccount("Elliott", 100, 100);

let accounts = ["Andrea", "Bob", "Catherine", "Doug"];
let prices = [5, 4, 3, 2, 1];
let volumes = [5, 10, 15, 20];
for (let i = 0; i < 50; i++) {
  let newOrder = matcher.createOrder(
    accounts[i % 4],
    matcher.buy,
    volumes[i % 4],
    prices[i % 5]
  );
  matcher.processOrder(newOrder);
}

prices = [4, 5, 6, 7, 8];
for (let i = 0; i < 50; i++) {
  let newOrder = matcher.createOrder(
    accounts[i % 4],
    matcher.sell,
    volumes[i % 4],
    prices[i % 5]
  );
  matcher.processOrder(newOrder);
}

matcher.throwErrors = true;
//matcher.errorMessages = true;

const dataPackage = (username) => {
  const aggregatedOrderBook = {
    Buy: matcher.aggregatedBuyOrders,
    Sell: matcher.aggregatedSellOrders,
  };
  const personalOrderBook = matcher.getPrivateBook(username);
  const tradeHistory = matcher.tradeHistory;
  const userData = matcher.accountList[username];
  const response = {
    aggregatedOrderBook,
    personalOrderBook,
    tradeHistory,
    userData,
  };
  return response;
};

var server = app.listen(3001, function () {
  console.log("app running on port.", server.address().port);
});

app.get("/", function (req, res) {
  res
    .status(200)
    .send(
      "Welcome to our matcher! " +
        matcher.buy +
        "! " +
        matcher.sell +
        "! Profit!"
    );
});

app.get("/users", function (req, res) {
  currentUsers = Object.keys(matcher.accountList);
  /*userTable = "";
  for (let user of currentUsers) {
    userTable +=
      user +
      " has £" +
      matcher.accountList[user].GBP +
      " and " +
      matcher.accountList[user].BTC +
      " BTC \n ";
  }*/
  res.status(200).send(currentUsers);
});

app.get("/user/:username", function (req, res) {
  let username = req.params.username;
  try {
    matcher.validateExistingUsername(username);
    const response = dataPackage(username);
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/orders/buy", function (req, res) {
  res.status(200).send(matcher.buyOrders.slice(0, 5));
});

app.get("/orders/sell", function (req, res) {
  res.status(200).send(matcher.sellOrders.slice(0, 5));
});

app.get("/trades", function (req, res) {
  res.status(200).send(matcher.tradeHistory);
});

app.get("/orders/aggregated", function (req, res) {
  let Buy = matcher.aggregatedBuyOrders;
  let Sell = matcher.aggregatedSellOrders;
  let aggregatedOrderBook = { Buy, Sell };
  res.status(200).send(aggregatedOrderBook);
});

app.get("/user/:username/orders", function (req, res) {
  let username = req.params.username;
  try {
    const response = dataPackage(username);
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.put("/user/:username/deposit/:currency", function (req, res) {
  let username = req.params.username;
  let currency = req.params.currency;
  let amount = Number(req.body.amount);
  try {
    //matcher.validateCurrency(currency);
    matcher.topUp(username, amount, currency);
    res.status(200).send(matcher.accountList[username]);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.put("/user/:username/withdraw/:currency", function (req, res) {
  let username = req.params.username;
  let currency = req.params.currency;
  let amount = Number(req.body.amount);
  console.log(amount);
  try {
    matcher.validateCurrency(currency);
    matcher.withdraw(username, amount, currency);
    res.status(200).send(matcher.accountList[username]);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/user", function (req, res) {
  var username = req.query.username;
  var startingGBP = Number(req.query.startingGBP);
  var startingBTC = Number(req.query.startingBTC);
  try {
    matcher.createAccount(username, startingGBP, startingBTC);
    res.status(201).send(matcher.accountList[username]);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/user/:username/order", function (req, res) {
  var username = req.params.username;
  var action = req.body.action;
  var volume = Number(req.body.volume);
  var price = Number(req.body.price);
  try {
    let newOrder = matcher.createOrder(username, action, volume, price);
    matcher.processOrder(newOrder);
    const response = dataPackage(username);
    res.status(201).send(response);
  } catch (err) {
    console.log("Error");
    res.status(400).send(err.message);
  }
});

app.delete("/user/:username/orders/:Orderid", function (req, res) {
  let username = req.params.username;
  let id = req.params.Orderid;
  try {
    action = matcher.validateExistingOrderId(id);
    let order;
    if (action === matcher.buy) {
      order = matcher.buyOrders.find((order) => order.id === id);
    } else if (action === matcher.sell) {
      order = matcher.sellOrders.find((order) => order.id === id);
    }
    try {
      if (order.username !== username) {
        throw new Error("Cannot cancel someone else's order");
      } else {
        matcher.cancelOrder(id);
        const response = dataPackage(username);
        res.status(200).send(response);
      }
    } catch (err) {
      res.status(403).send(err.message);
    }
    //matcher.validateCurrency(currency);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.delete("/user/:username/orders/", function (req, res) {
  let username = req.params.username;
  try {
    matcher.cancelAllOrders(username);
    const response = dataPackage(username);
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send(err.message);
  }
});
