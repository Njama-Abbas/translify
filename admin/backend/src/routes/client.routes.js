const clientController = require("../controllers/client.controller");
const {
  user_sift
} = require("../middlewares")
const Router = require("express").Router();

Router.post("/create", [
    user_sift.checkDuplicateEmail, user_sift.checkDuplicatePhoneNo, user_sift.checkRolesExisted
  ],
  clientController.create);

Router.get("/", clientController.fetch);

Router.get("/:id", clientController.get);

Router.delete("/:id", clientController.delete);

module.exports = Router;