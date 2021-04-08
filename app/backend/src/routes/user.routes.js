const Router = require("express").Router();

const { authJwt } = require("../middlewares");
const userController = require("../controllers/user.controller");

Router.get("/public", userController.allAccess);

Router.get(
  "/client",
  [authJwt.verifyToken, authJwt.verifyStatus, authJwt.isClient],
  userController.userDashBoard
);

Router.get(
  "/driver",
  [authJwt.verifyToken, authJwt.verifyStatus, authJwt.isDriver],
  userController.userDashBoard
);

module.exports = Router;
