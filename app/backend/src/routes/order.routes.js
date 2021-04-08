const Router = require("express").Router();

const ordersController = require("../controllers/order.controller");

Router.get("/user", ordersController.getAllOrdersByUserId);

Router.post("/create", ordersController.creteOrder);

Router.post("/update", ordersController.updateOrder);

module.exports = Router;
