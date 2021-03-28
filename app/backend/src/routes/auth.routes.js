const { verifySignUp } = require("../middlewares");
const AuthController = require("../controllers/auth.controller");

module.exports = function (app) {
  app.post(
    "/api/auth/signup",
    [verifySignUp.checkDuplicateEmail, verifySignUp.checkRolesExisted],
    AuthController.signup
  );

  app.post("/api/auth/signin", AuthController.signin);

  app.post("/api/auth/verify-account", AuthController.verify);

  app.post("/api/auth/resend-vcode", AuthController.resendVerificationCode);
};
