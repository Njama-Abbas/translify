const client = require("./client.routes");
const driver = require("./driver.routes");
const order = require("./orders.routes");
const user = require("./user.routes");
const auth = require("./auth.routes");
const photo = require("./photos.routes");

module.exports = {
  driver,
  client,
  order,
  user,
  auth,
  photo,
};
