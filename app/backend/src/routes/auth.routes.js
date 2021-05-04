const Router = require("express").Router();

const { user_sift } = require("../middlewares");
const AuthController = require("../controllers/auth.controller");

Router.post(
  "/signup",
  [
    user_sift.checkDuplicateEmail,
    user_sift.checkDuplicatePhoneNo,
    user_sift.checkRolesExisted,
  ],
  AuthController.signup
);

Router.post("/signin", AuthController.signin);

Router.post("/verify-account", AuthController.verify);

Router.post("/resend-vcode", AuthController.resendVerificationCode);

Router.put("/update-info", AuthController.updateInfo);

Router.post("/change-password-auth", AuthController.sendChangePasswordAuthCode);

Router.post("/reset-password-auth", AuthController.sendResetPasswordAuthCode);

Router.post("/change-password", AuthController.changePassword);

module.exports = Router;
