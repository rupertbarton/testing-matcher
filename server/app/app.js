const { sendData } = require("./responses");
const express = require("express");
var bodyParser = require("body-parser");
const app = express();

const { createServer } = require("http");
const httpServer = createServer(app);

const { Server } = require("socket.io");
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(bodyParser.json());

const Matcher = require("./matcher");
const { initialiseMatcher } = require("./initialise");
const { disconnect } = require("process");

let matcher = new Matcher();

initialiseMatcher(matcher);

app.get("/", (req, res) => {
  res.send("Bitcoin Server");
});

io.on("connection", (socket) => {
  console.log("User connected with id" + socket.id);
  const ID = socket.id;
  let currentUser;
  socketPackage = { socket, io, matcher };

  socket.on("initialise", (username) => {
    console.log("initialising");
    currentUser = username;
    socket.join(currentUser);
    sendData(socketPackage, currentUser);
  });

  socket.on("switchUser", (username) => {
    socket.leave(currentUser);
    socket.join(username);
    sendData(socketPackage, username);
    currentUser = username;
  });

  socket.on("topUp", (JSONstring) => {
    try {
      const { currency, amount } = JSON.parse(JSONstring);
      matcher.topUp(currentUser, amount, currency);
      sendData(socketPackage, currentUser);
    } catch (err) {
      io.to(ID).emit("error", err.message);
    }
  });

  socket.on("withdraw", (JSONstring) => {
    try {
      const { currency, amount } = JSON.parse(JSONstring);
      matcher.withdraw(currentUser, amount, currency);
      sendData(socketPackage, currentUser);
    } catch (err) {
      io.to(ID).emit("error", err.message);
    }
  });

  socket.on("addOrder", (JSONstring) => {
    try {
      const orderData = JSON.parse(JSONstring);
      let newOrder = matcher.createOrder(
        orderData.username,
        orderData.action,
        orderData.volume,
        orderData.price
      );
      matcher.processOrder(newOrder);
      sendData(socketPackage);
    } catch (err) {
      io.to(ID).emit("error", err.message);
    }
  });

  socket.on("addOrderBot", (JSONstring) => {
    let buyPrices = Object.keys(matcher.aggregatedBuyOrders);
    let sellPrices = Object.keys(matcher.aggregatedSellOrders);
    buyPrices.sort((a, b) => Number(b) - Number(a));
    sellPrices.sort((a, b) => Number(a) - Number(b));
    const oldMarketPrice =
      (Number(buyPrices[0] || 0.1) + Number(sellPrices[0] || 9.9)) / 2;

    try {
      const orderData = JSON.parse(JSONstring);
      let newOrder = matcher.createOrder(
        orderData.username,
        orderData.action,
        orderData.volume,
        orderData.price
      );
      matcher.processOrder(newOrder);
      sendData(socketPackage);
    } catch (err) {
      io.to(ID).emit("error", err.message);
    }
    buyPrices = Object.keys(matcher.aggregatedBuyOrders);
    sellPrices = Object.keys(matcher.aggregatedSellOrders);
    buyPrices.sort((a, b) => Number(b) - Number(a));
    sellPrices.sort((a, b) => Number(a) - Number(b));
    console.log(buyPrices[0]);
    console.log(sellPrices[0]);
    const newMarketPrice =
      (Number(buyPrices[0] || 0.1) + Number(sellPrices[0] || 9.9)) / 2;
    console.log("price", newMarketPrice);
    io.to(ID).emit(
      "botResponse",
      JSON.stringify({ oldMarketPrice, newMarketPrice })
    );
  });

  socket.on("deleteOrder", (id) => {
    try {
      const action = matcher.validateExistingOrderId(id);
      let order;
      if (action === matcher.buy) {
        order = matcher.buyOrders.find((order) => order.id === id);
      } else if (action === matcher.sell) {
        order = matcher.sellOrders.find((order) => order.id === id);
      }
      if (order.username !== currentUser) {
        throw new Error("Cannot cancel someone else's order");
      }
      matcher.cancelOrder(id);
      sendData(socketPackage);
    } catch (err) {
      io.to(ID).emit("error", err.message);
    }
  });

  socket.on("deleteAllOrders", (username) => {
    try {
      if (username !== currentUser) {
        throw new Error("Cannot cancel someone else's order");
      }
      matcher.cancelAllOrders(username);
      sendData(socketPackage);
    } catch (err) {
      io.to(ID).emit("error", err.message);
    }
  });

  socket.on("disconnect", () => console.log("disconnected"));
});

httpServer.listen(3001, () => {
  console.log(`socket.io server listening on port 3001`);
});
