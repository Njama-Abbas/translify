const bcrypt = require("bcrypt"),
  db = require("../models"),
  systemError = require("../utils/error.utils");
const {
  composeDriverResponseObj,
  composeUserResponseObj,
} = require("../utils/response.utils");
const USER = db.user;
const ROLE = db.role;
const DRIVER = db.driver;

module.exports = {
  async create(req, res) {
    const {
      firstname,
      lastname,
      phoneno,
      username,
      password: userPassword,
      address,
      dlno,
      truckno,
    } = req.body;

    const $role = await ROLE.findOne({
      name: "driver",
    });

    if (!$role) {
      let e = systemError.NOT_FOUND_ERROR("Role");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }

    let user;
    try {
      user = await USER.create({
        firstname,
        lastname,
        phoneno,
        username,
        password: bcrypt.hashSync(userPassword, 10),
        role: $role._id,
      });
      await user.save();
    } catch (error) {
      let e = systemError.CREATION_ERROR("User");
      res.status(e.status).json({
        message: e.message,
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
      let e = systemError.CREATION_ERROR("Driver");
      res.status(e.status).json({
        message: e.message,
        error,
      });
      return;
    }
    res.status(200).json(composeDriverResponseObj(driver, user));
  },
  async fetch(req, res) {
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
      let e = systemError.NOT_FOUND_ERROR("Drivers");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }
    const drivers = await Promise.all(
      users.map(async (user) => {
        const exists = await DRIVER.findOne({
          userId: user._id,
        });
        if (exists) {
          return composeDriverResponseObj(exists, user);
        }
      })
    );
    res.set("Content-Range", drivers.length);
    res.status(200).json(drivers.filter((driver) => driver));
  },

  async get(req, res) {
    const driver_id = req.params.id;
    const driver = await DRIVER.findById(driver_id);

    if (!driver) {
      let e = systemError.NOT_FOUND_ERROR("Driver");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }

    const user = await USER.findById(driver.userId);

    if (!user) {
      let e = systemError.NOT_FOUND_ERROR("User");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }
    res.status(200).json(composeDriverResponseObj(driver, user));
  },

  async approve(req, res) {
    const { driverId, status } = req.body;

    let approvedDriver;
    try {
      approvedDriver = await DRIVER.findByIdAndUpdate(
        driverId,
        {
          approval_status: status,
        },
        { new: true }
      );
    } catch (error) {
      let e = systemError.UPDATE_ERROR("Driver Approval");
      res.status(e.status).json({
        message: e.message,
        error,
      });
      return;
    }
    let user = await USER.findById(approvedDriver.userId);

    res.status(200).json(composeDriverResponseObj(approvedDriver, user));
  },
  async delete(req, res) {
    const driverId = req.params.id;
    const driver = await DRIVER.findById(driverId);
    if (!driver) {
      let e = systemError.NOT_FOUND_ERROR("Driver");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }

    let deletedUser;
    try {
      deletedUser = await USER.findByIdAndDelete(driver.userId);
    } catch (error) {
      let e = systemError.DELETE_ERROR("User");
      res.status(e.status).json({
        message: e.message,
        error,
      });
      return;
    }

    let deletedDriver;
    try {
      deletedDriver = await DRIVER.findByIdAndDelete(driver._id);
    } catch (error) {
      let e = systemError.DELETE_ERROR("Driver");
      res.status(e.status).json({
        message: e.message,
        error,
      });
      return;
    }
    res.status(204).json({});
  },
  async update(req, res) {
    const { id, status } = req.body;
    const driver = await DRIVER.findById(id);

    if (!driver) {
      let e = systemError.NOT_FOUND_ERROR("User");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }

    let updatedUser;
    try {
      updatedUser = await USER.findByIdAndUpdate(
        driver.userId,
        {
          account_status: status,
        },
        { new: true }
      );
    } catch (error) {
      let e = systemError.UPDATE_ERROR("User Status");
      res.status(e.status).json({
        message: e.message,
        error,
      });
      return;
    }
    if (!updatedUser) {
      let e = systemError.NOT_FOUND_ERROR("User");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }

    res.status(200).json(composeDriverResponseObj(driver, updatedUser));
  },
};
