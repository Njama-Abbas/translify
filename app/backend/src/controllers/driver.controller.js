const mongoose = require("mongoose");
const db = require("../models");
const User = db.user;
const Driver = db.driver;
const Role = db.role;

module.exports = {
  complete_registration: async (req, res, next) => {
    const { userId, truckno, dlno, address } = req.body;

    const newDriver = await Driver.create({
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

    const driver = await Driver.findOne({
      userId,
    });

    if (!driver) {
      res.status(404).json({
        message: "Sorry!! You aint approved Yet",
      });
      return;
    }

    res.status(200).json(driver);
  },

  getById: async (req, res) => {
    const id = req.headers.id;
    const driver = await Driver.findById(id);

    if (!driver) {
      res.status(404).json({
        message: "Driver Not Found",
      });
      return;
    }

    const user = await User.findOne({
      userId: driver.userId,
    });

    if (!user) {
      res.status(404).json({
        message: "User Not Found",
      });
      return;
    }

    res.status(200).json({
      id: driver._id,
      userid: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      phoneno: user.phoneno,
      email: user.email,
      rating: user.rating,
      truckno: driver.truckno,
      dlno: driver.dlno,
      address: driver.address.place_name,
      approval_status: format_approval(driver.approval_status),
      created_at: new Date(driver.dateOfReg),
    });
  },

  getOnCall: async (req, res) => {
    const driver_role = await Role.findOne({
      name: "driver",
    });
    if (!driver_role) {
      res.status(404).json({
        message: "Role Not Found",
      });
      return;
    }

    //get all users who have a role of driver
    const users = await User.find({
      role: driver_role._id,
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
        const driver = await Driver.findOne({
          userId: user._id,
        });
        if (driver) {
          return {
            id: driver._id,
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
  getTest: async (req, res) => {
    res.send("Test");
  },
};
