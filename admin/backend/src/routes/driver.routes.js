const driverController = require("../controllers/driver.controller");

const Router = require("express").Router();

Router.get("/", driverController.fetch);

Router.get("/:id", driverController.get);

Router.post("/approve", driverController.approve);

Router.post("/update_status", driverController.update);

Router.delete("/:id", driverController.delete);

module.exports = Router;
