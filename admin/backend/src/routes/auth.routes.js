const Router = require("express").Router();
const AuthController = require("../controllers/auth.controller");

Router.post("/signin", AuthController.signin);

Router.put("/update-info", AuthController.updateInfo);

Router.post("/reset-password-auth", AuthController.sendPasswordResetAuthCode);

Router.post("/change-password", AuthController.changePassword);
Router.post("/reset-password", AuthController.resetPassword);

Router.get("/acc_balance", AuthController.accountBalance);

module.exports = Router;
