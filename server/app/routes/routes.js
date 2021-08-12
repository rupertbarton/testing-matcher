const Matcher = require("../matcher");

let matcher = new Matcher();

matcher.throwErrors = true;

matcher.createAccount("Andrea", 100, 50);
matcher.createAccount("Elliott", 20, 100);

var appRouter = function (app) {};

module.exports = appRouter;
