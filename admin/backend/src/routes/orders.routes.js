const orderController = require("../controllers/orders.controller");
const Router = require("express").Router();

Router.get("/x-user", orderController.fetchById);

Router.get("/", orderController.fetch);

Router.get("/:id", orderController.get);

module.exports = Router;
