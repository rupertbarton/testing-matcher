function initialiseMatcher(matcher) {
  matcher.createAccount("Andrea", 500, 500);
  matcher.createAccount("Bob", 500, 500);
  matcher.createAccount("Catherine", 500, 500);
  matcher.createAccount("Doug", 500, 500);
  matcher.createAccount("Elliott", 500, 500);

  let accounts = ["Andrea", "Bob", "Catherine", "Doug"];
  let prices = [5, 4, 3, 2, 1];
  let offset = [0.2, 0.5, 0.1];
  let volumes = [5, 10, 15, 10];
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

  for (let i = 0; i < 50; i++) {
    let newOrder = matcher.createOrder(
      accounts[i % 4],
      matcher.buy,
      volumes[i % 4],
      prices[i % 5] + offset[i % 3]
    );
    matcher.processOrder(newOrder);
  }

  prices = [4, 5, 6, 7, 8];
  for (let i = 0; i < 50; i++) {
    let newOrder = matcher.createOrder(
      accounts[i % 4],
      matcher.sell,
      volumes[i % 4],
      prices[i % 5] - offset[i % 3]
    );
    matcher.processOrder(newOrder);
  }

  for (let i = 0; i < 10; i++) {
    let newOrder = matcher.createOrder(
      accounts[i % 4],
      matcher.buy,
      volumes[i % 4],
      prices[i % 5] + offset[i % 3]
    );
    matcher.processOrder(newOrder);
  }

  for (let i = 0; i < 50; i++) {
    let newOrder = matcher.createOrder(
      accounts[i % 4],
      matcher.buy,
      volumes[i % 4],
      prices[i % 5] + 5 * offset[i % 3]
    );
    matcher.processOrder(newOrder);
  }

  for (let i = 0; i < 50; i++) {
    let newOrder = matcher.createOrder(
      accounts[i % 4],
      matcher.sell,
      volumes[i % 4],
      prices[i % 5] - offset[i % 3]
    );
    matcher.processOrder(newOrder);
  }

  matcher.throwErrors = true;
}

module.exports = { initialiseMatcher };
