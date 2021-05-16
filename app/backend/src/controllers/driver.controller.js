const db = require("../models");
const USER = db.user,
  DRIVER = db.driver,
  ROLE = db.role;

module.exports = {
  complete_registration: async (req, res, next) => {
    const { userId, truckno, dlno, address } = req.body;

    const newDriver = await DRIVER.create({
      userId,
      truckno,
      dlno,
      address,
    });

    const is_save = newDriver.save();
    if (!is_save) {
      res.status(500).json({
        message: is_save.errors,
      });
    }

    res.status(200).json({
      message: "Registartion successfull",
    });

    next();
  },

  check_approval: async (req, res) => {
    const { userid: userId } = req.headers;

    const driver = await DRIVER.findOne({
      userId,
    });

    if (!driver) {
      res.status(404).json({
        message: "Sorry!! You are not a registered driver Yet",
      });
      return;
    }

    res.status(200).json({
      approval_status: driver.approval_status,
    });
  },

  getById: async (req, res) => {
    const id = req.headers.driverid;

    const driver = await DRIVER.findById(id);

    if (!driver) {
      res.status(404).json({
        message: "Driver Not Found",
      });
      return;
    }

    const user = await USER.findOne({
      _id: driver.userId,
    });

    if (!user) {
      res.status(404).json({
        message: "User Not Found",
      });
      return;
    }

    res.status(200).json({
      id: driver._id,
      userId: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      phoneno: user.phoneno,
      truckno: driver.truckno,
    });
  },

  getOnCall: async (req, res) => {
    const driver_role = await ROLE.findOne({
      name: "driver",
    });
    if (!driver_role) {
      res.status(404).json({
        message: "Role Not Found",
      });
      return;
    }

    //get all users who have a role of driver and account status is active
    const users = await USER.find({
      role: driver_role._id,
      account_status: "ACTIVE",
    });

    if (!users) {
      res.status(404).json({
        message: "Drivers Not Found",
      });
      return;
    }

    //map the driving details and personal details
    const drivers = await Promise.all(
      users.map(async (user) => {
        const driver = await DRIVER.findOne({
          userId: user._id,
        });
        if (driver) {
          return {
            id: driver._id,
            userId: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            phoneno: user.phoneno,
            oncall: driver.oncall,
            reserved: driver.reserved,
            rating: user.rating,
            truckno: driver.truckno,
            dlno: driver.dlno,
            approval_status: driver.approval_status,
          };
        }
      })
    );

    //filter out unregistred drivers
    const $drivers = drivers.filter((driver) => driver);

    //get approved drivers currently on call and not reserved
    const availableDrivers = $drivers.filter(
      (driver) =>
        driver.oncall && driver.approval_status === "A" && !driver.reserved
    );
    res.status(200).json(availableDrivers);
  },

  checkDutyStatus: async (req, res) => {
    const { userid: userId } = req.headers;

    const driver = await DRIVER.findOne({
      userId,
    });

    if (!driver) {
      res.status(404).json({
        message: `FAILED!
        Driver Not Found
        `,
      });
      return;
    }

    res.status(200).json({
      duty_status: driver.oncall,
    });
  },

  changeDutyStatus: async (req, res) => {
    const { userId, duty_status } = req.body;

    const driver = await DRIVER.findOne({
      userId,
    });

    if (!driver) {
      res.status(404).json({
        message: `FAILED!
        Driver Not Found
        `,
      });
      return;
    }

    let updatedDriver;

    try {
      updatedDriver = await DRIVER.findByIdAndUpdate(driver._id, {
        oncall: duty_status,
      });
      await updatedDriver.save();
    } catch (error) {
      res.status(404).json({
        message: `FAILED!
        Changing duty status UNSUCCESSFULL
        `,
      });
      return;
    }
    res.status(200).json({
      message: `SUCCESS! Duty status updated`,
      duty_status: updatedDriver.oncall,
    });
  },
};
