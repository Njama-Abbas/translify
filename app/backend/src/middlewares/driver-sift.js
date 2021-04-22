const db = require("../models");
const DRIVER = db.driver;

module.exports = {
  checkDuplicateUserId: async (req, res, next) => {
    const {
      userId
    } = req.body;

    const driver = DRIVER.findOne({
      userId
    });

    if (driver) {
      res.status(409).json({
        message: `FAILED!
        Driver Has already been registered
        `,
      });
      return;
    }
    next();
  },
  checkDuplicateTruckNo: async (req, res, next) => {
    const {
      truckno
    } = req.body;

    const driver = DRIVER.findOne({
      truckno
    });

    if (driver) {
      res.status(409).json({
        message: `FAILED! 
        Truck ${truckno} + " is already registered"
        `,
      });
      return;
    }
    next();
  },
  checkDuplicateDlno: async (req, res, next) => {
    const {
      dlno
    } = req.body;

    const driver = DRIVER.findOne({
      dlno
    });

    if (driver) {
      res.status(409).json({
        message: `FAILED!
        LICENCE  ${dlno} is already registered `,
      });
      return;
    }
    next();
  }
}