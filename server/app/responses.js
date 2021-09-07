const sendAggregatedOB = (io, matcher) => {
  const aggregatedOrderBook = {
    Buy: matcher.aggregatedBuyOrders,
    Sell: matcher.aggregatedSellOrders,
  };
  io.emit("aggregatedOB", JSON.stringify(aggregatedOrderBook));
};

const sendTradeHistory = (io, matcher) => {
  io.emit(
    "tradeHistory",
    JSON.stringify({ tradeHistory: matcher.tradeHistory })
  );
};

const sendPersonalOB = (io, matcher, username) => {
  if (username !== undefined) {
    io.to(username).emit(
      "personalOB",
      JSON.stringify(matcher.getPrivateBook(username))
    );
  } else {
    for (user in matcher.accountList) {
      io.to(user).emit(
        "personalOB",
        JSON.stringify(matcher.getPrivateBook(user))
      );
    }
  }
};

const sendUserData = (io, matcher, username) => {
  if (username !== undefined) {
    io.to(username).emit(
      "userData",
      JSON.stringify(matcher.accountList[username])
    );
  } else {
    for (user in matcher.accountList) {
      io.to(user).emit("userData", JSON.stringify(matcher.accountList[user]));
    }
  }
};

const sendData = ({ socket, io, matcher }, username = undefined) => {
  sendAggregatedOB(io, matcher);
  sendTradeHistory(io, matcher);
  sendPersonalOB(io, matcher, username);
  sendUserData(io, matcher, username);
};

module.exports = { sendData };
