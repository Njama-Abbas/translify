const Router = require("express").Router();

const { user_sift } = require("../middlewares");
const AuthController = require("../controllers/auth.controller");

Router.post(
  "/signup",
  [
    user_sift.checkDuplicateUserName,
    user_sift.checkDuplicatePhoneNo,
    user_sift.checkRolesExisted,
  ],
  AuthController.signup
);

Router.post("/signin", AuthController.signin);

Router.post("/verify-account", AuthController.verify);

Router.post("/resend-vcode", AuthController.resendVerificationCode);

Router.get("/acc_balance", AuthController.accountBalance);

Router.put("/update-info", AuthController.updateInfo);

Router.post("/reset-password-auth", AuthController.sendPasswordResetAuthCode);

Router.post("/change-password", AuthController.changePassword);

Router.post("/reset-password", AuthController.resetPassword);

module.exports = Router;
