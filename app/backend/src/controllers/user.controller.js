const db = require("../models");
const USER = db.user;
const ROLE = db.role;
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

    res.status(200).json({
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      phoneno: user.phoneno,
      rating: user.rating,
      role: role.name,
      verification: user.verification,
      id: user.id,
    });
  },
};
