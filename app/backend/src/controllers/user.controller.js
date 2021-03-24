const db = require("../models");
const User = db.user;
const Role = db.role;

module.exports = {
  allAccess: async (_req, res) => {
    res.status(200).json({
      content: "Public content",
    });
  },

  driverBoard: async (req, res) => {
    const driver_role = await Role.findOne({
      name: "driver",
    });

    const user = await User.findOne({
      _id: req.userId,
    });

    if (!user) {
      res.status(404).json({
        message: "user not found",
      });
      return;
    }

    if (user.role !== driver_role._id) {
      res.status(403).json({
        message: "Require Driver Role",
      });
      return;
    }

    if (!user.verification.status) {
      res.status(401).json({
        message: "Not authorized user is unverified",
      });
      return;
    }

    res.status(200).json({
      userId: user._id,
      role: "driver",
    });
  },

  clientBoard: async (req, res) => {
    const client_role = await Role.findOne({
      name: "client",
    });

    const user = await User.findOne({
      _id: req.userId,
    });

    if (!user) {
      res.status(404).json({
        message: "user not found",
      });
      return;
    }

    if (user.role !== client_role._id) {
      res.status(403).json({
        message: "Require Client Role",
      });
      return;
    }

    if (!user.verification.status) {
      res.status(401).json({
        message: "Not authorized user is unverified",
      });
      return;
    }

    res.status(200).json({
      userId: user._id,
      role: "client",
    });
  },
};
