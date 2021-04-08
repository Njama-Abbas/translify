const Router = require("express").Router();

const driverController = require("../controllers/driver.controller");
const { sift } = require("../middlewares");

Router.get("/findone", driverController.getById);

Router.get("/drivers-on-call", driverController.getOnCall);

Router.get("/check-verification", driverController.check_approval);

Router.post(
  "/complete-registration",
  [
    sift.checkDuplicateUserId,
    sift.checkDuplicateDlno,
    sift.checkDuplicateTruckNo,
  ],
  driverController.complete_registration
);

module.exports = Router;
