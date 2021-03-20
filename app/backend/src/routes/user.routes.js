const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.get("/api/user/public", controller.allAccess);

  app.get(
    "/api/user/client",
    [authJwt.verifyToken, authJwt.isClient],
    controller.clientBoard
  );

  app.get(
    "/api/user/driver",
    [authJwt.verifyToken, authJwt.isDriver],
    controller.driverBoard
  );

  app.get(
    "/api/user/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};
