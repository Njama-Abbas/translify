const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.get("/api/user/public", controller.allAccess);

  app.get(
    "/api/user/client",
    [authJwt.verifyToken, authJwt.verifyStatus, authJwt.isClient],
    controller.userDashBoard
  );

  app.get(
    "/api/user/driver",
    [authJwt.verifyToken, authJwt.verifyStatus, authJwt.isDriver],
    controller.userDashBoard
  );
};
