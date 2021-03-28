const db = require("../models");
const User = db.user;
const Driver = db.driver;

module.exports = {
  allAccess: async (_req, res) => {
    res.status(200).json({
      content: "Public content",
    });
  },

  userDashBoard: async (req, res) => {
    const user = await User.findOne({
      _id: req.userId,
    });
    res.status(200).json(user);
  },
};
