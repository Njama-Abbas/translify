const client = require("./client.routes");

const driver = require("./driver.routes");

const order = require("./orders.routes");

module.exports = {
  driver,
  client,
  order,
};
