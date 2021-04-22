const Router = require("express").Router();

const driverController = require("../controllers/driver.controller");
const {
  driver_sift
} = require("../middlewares");

Router.get("/findone", driverController.getById);

Router.get("/on-call", driverController.getOnCall);

Router.get("/check-verification", driverController.check_approval);

Router.post(
  "/complete-registration",
  [
    driver_sift.checkDuplicateUserId,
    driver_sift.checkDuplicateDlno,
    driver_sift.checkDuplicateTruckNo,
  ],
  driverController.complete_registration
);

module.exports = Router;