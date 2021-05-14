const clientController = require("../controllers/client.controller");
const Router = require("express").Router();

Router.get("/", clientController.fetch);

Router.get("/:id", clientController.get);

Router.post("/update_status", clientController.update);

Router.delete("/:id", clientController.delete);

module.exports = Router;
