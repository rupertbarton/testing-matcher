const Matcher = require("../matcher");

let matcher = new Matcher();

matcher.throwErrors = true;

matcher.createAccount("Andrea", 100, 50);
matcher.createAccount("Elliott", 20, 100);

var appRouter = function (app) {
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
    userTable = "";
    for (let user of currentUsers) {
      userTable +=
        user +
        " has £" +
        matcher.accountList[user].GBP +
        " and " +
        matcher.accountList[user].BTC +
        " BTC \n ";
    }
    res.status(200).send(userTable);
  });

  app.get("/user/:id", function (req, res) {
    let username = req.params.id;
    let userGBP = matcher.accountList[username].GBP;
    let userBTC = matcher.accountList[username].BTC;
    res
      .status(200)
      .send(username + " has £" + userGBP + " and " + userBTC + " BTC!");
  });

  app.post("/user", function (req, res) {
    var username = req.query.username;
    var startingGBP = Number(req.query.startingGBP);
    var startingBTC = Number(req.query.startingBTC);
    matcher.createAccount(username, startingGBP, startingBTC);
    console.log(username);
    res
      .status(201)
      .send(
        "Success! New user " +
          username +
          " created with £" +
          matcher.accountList[username].GBP +
          " and " +
          matcher.accountList[username].BTC +
          " Bitcoin"
      );
  });

  app.post("/order", function (req, res) {
    var username = req.query.username;
    var action = req.query.action;
    var volume = Number(req.query.volume);
    var price = Number(req.query.price);
    let newOrder = matcher.createOrder(username, action, volume, price);
    matcher.processOrder(newOrder);
    res.status(201).send(newOrder);
  });
};

module.exports = appRouter;
