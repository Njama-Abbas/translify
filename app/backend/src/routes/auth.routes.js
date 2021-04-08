const Router = require("express").Router();

const { verifySignUp } = require("../middlewares");
const AuthController = require("../controllers/auth.controller");

Router.post(
  "/signup",
  [verifySignUp.checkDuplicateEmail, verifySignUp.checkRolesExisted],
  AuthController.signup
);

Router.post("/signin", AuthController.signin);

Router.post("/verify-account", AuthController.verify);

Router.post("/resend-vcode", AuthController.resendVerificationCode);

module.exports = Router;
