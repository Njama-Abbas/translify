const Router = require("express").Router();
const { Mpesa } = require("../middlewares");
const mpesaController = require("../controllers/mpesa.controller");
const ordersController = require("../controllers/order.controller");

Router.get("/user", ordersController.getAllOrdersByUserId);

Router.post(
  "/create",
  [Mpesa.reqMpesaToken, Mpesa.stkPush],
  ordersController.creteOrder
);

Router.post("/update", ordersController.updateOrder);

module.exports = Router;
