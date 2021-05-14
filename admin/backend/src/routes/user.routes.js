const Router = require("express").Router();
const { authJwt } = require("../middlewares");
const userController = require("../controllers/user.controller");
Router.get(
  "/admin",
  [authJwt.verifyToken, authJwt.isAdmin],
  userController.adminBoard
);

module.exports = Router;
