const bcrypt = require("bcrypt");
const db = require("../models");
const USER = db.user;
const ROLE = db.role;
const DRIVER = db.driver;

module.exports = {
  create: async (req, res) => {
    const {
      firstname,
      lastname,
      phoneno,
      email,
      password: userPassword,
      address,
      dlno,
      truckno,
    } = req.body;

    const $role = await ROLE.findOne({
      name: "driver",
    });

    if (!$role) {
      res.status(404).json({
        message: "Role not found",
      });
      return;
    }

    let user;
    try {
      user = await USER.create({
        firstname,
        lastname,
        phoneno,
        email,
        password: bcrypt.hashSync(userPassword, 10),
        role: $role._id,
      });
      await user.save();
    } catch (error) {
      res.status(500).json({
        message: `FAILED!
        Process to create 'USER' for role 'DRIVER' UNSUCCESSFUL`,
        error,
      });
      return;
    }

    let driver;

    try {
      driver = await DRIVER.create({
        userId: user._id,
        dlno,
        truckno,
        address,
      });
      await driver.save();
    } catch (error) {
      res.status(500).json({
        message: `FAILED!
        Process to register 'DRIVER' UNSUCCESSFUL`,
        error,
      });
      return;
    }
    res.status(200).json(driverResponseObject(driver, user));
  },
  fetch: async (req, res) => {
    const driver_role = await ROLE.findOne({
      name: "driver",
    });

    if (!driver_role) {
      res.status(404).json({
        message: "Role Not Found",
      });
      return;
    }

    const users = await USER.find({
      role: driver_role.id,
    });

    if (!users) {
      res.status(404).json({
        message: `FAILED!
        Drivers Not Found`,
      });
      return;
    }
    const drivers = await Promise.all(
      users.map(async (user) => {
        const exists = await DRIVER.findOne({
          userId: user._id,
        });
        if (exists) {
          return driverResponseObject(exists, user);
        }
      })
    );
    res.set("Content-Range", drivers.length);
    res.status(200).json(drivers);
  },

  get: async (req, res) => {
    const driver_id = req.params.id;

    const driver = await DRIVER.findOne({
      _id: driver_id,
    });

    if (!driver) {
      res.status(404).json({
        message: `FAILED!
        Driver Not Found`,
      });
      return;
    }

    const user = await USER.findOne({
      _id: driver.userId,
    });

    if (!user) {
      res.status(404).json({
        message: `FAILED!
        User Not Found`,
      });
      return;
    }

    res.status(200).json(driverResponseObject(driver, user));
  },

  approve: async (req, res) => {
    const { driverId, status } = req.body;

    let approvedDriver;
    try {
      approvedDriver = await DRIVER.findByIdAndUpdate(driverId, {
        approval_status: status,
      });
      await approvedDriver.save();
    } catch (error) {
      res.status(500).json({
        message: `FAILED!
         Driver Approval Unsuccessful
         `,
      });
    }
  },
  delete: async (req, res) => {
    const driverId = req.params.id;

    const driver = await DRIVER.findById(driverId);

    if (!driver) {
      res.status(404).json({
        message: `FAILED!
        Driver Not Found`,
      });
      return;
    }

    let deletedUser;
    try {
      deletedUser = await USER.findByIdAndDelete(driver.userId);
    } catch (error) {
      res.status(500).json({
        message: `FAILED!
        Deletion process unsuccessful`,
        error,
      });
      return;
    }

    let deletedDriver;
    try {
      deletedDriver = await DRIVER.findByIdAndDelete(driver._id);
    } catch (error) {
      res.status(500).json({
        message: `FAILED!
        Could not delete driver`,
        error,
      });
      return;
    }
    res.status(204).json({
      message: "DELETE == SUCCESS",
    });
  },
};

const format_approval = (value) => {
  switch (value) {
    case "A":
      return "Approved";
    case "D":
      return "Declined";
    case "P":
    default:
      return "Pending";
  }
};

const driverResponseObject = (driver, user) => ({
  id: driver._id,
  userId: user._id,
  firstname: user.firstname,
  lastname: user.lastname,
  phoneno: user.phoneno,
  email: user.email,
  rating: user.rating,
  v_status: user.verification.status,
  truckno: driver.truckno,
  dlno: driver.dlno,
  address: driver.address.place_name,
  approval_status: format_approval(driver.approval_status),
  created_at: new Date(driver.dateOfReg),
});
