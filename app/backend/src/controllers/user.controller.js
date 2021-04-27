const db = require("../models");
const config = require("../config/auth.config");
const USER = db.user;
const ROLE = db.role;
const { userResponseObject } = require("../utils/response");

module.exports = {
  allAccess: async (_req, res) => {
    res.status(200).json({
      content: "Public content",
    });
  },

  userDashBoard: async (req, res) => {
    const user = await USER.findOne({
      _id: req.userId,
    });

    const role = await ROLE.findOne({
      _id: user.role,
    });

    res.status(200).json(userResponseObject(user, role));
  },
};
