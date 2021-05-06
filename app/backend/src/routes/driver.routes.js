const Router = require("express").Router();

const driverController = require("../controllers/driver.controller");
const { driver_sift } = require("../middlewares");

Router.get("/findone", driverController.getById);

Router.get("/on-call", driverController.getOnCall);

Router.get("/check-approval", driverController.check_approval);

Router.post(
  "/complete-registration",
  [
    driver_sift.checkDuplicateUserId,
    driver_sift.checkDuplicateDlno,
    driver_sift.checkDuplicateTruckNo,
  ],
  driverController.complete_registration
);

Router.get("/duty-status", driverController.checkDutyStatus);
Router.post("/duty-status", driverController.changeDutyStatus);

module.exports = Router;
