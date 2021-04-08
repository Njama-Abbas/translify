const user = require("./user.routes");
const mpesa = require("./mpesa.routes");
const orders = require("./order.routes");
const auth = require("./auth.routes");
const driver = require("./driver.routes");
const photos = require("./photos.routes");

module.exports = {
  user,
  mpesa,
  orders,
  auth,
  driver,
  photos,
};
