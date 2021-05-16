const db = require("../models");
const ROLES = db.ROLES;
const USER = db.user;

module.exports = {
  checkDuplicateUserName: async (req, res, next) => {
    const { username } = req.body;

    const user = await USER.findOne({
      username,
    });

    if (user) {
      res.status(409).json({
        message: `FAILED!
         Username is already in use`,
      });
      return;
    }

    next();
  },
  checkDuplicatePhoneNo: async (req, res, next) => {
    const { phoneno: user_phoneno } = req.body;

    const user = await USER.findOne({
      phoneno: "254" + user_phoneno.slice(-9),
    });

    if (user) {
      res.status(409).json({
        message: `FAILED!
        Phone No is already Registered`,
      });
      return;
    }

    next();
  },

  checkRolesExisted: async (req, res, next) => {
    const { role } = req.body;

    if (role) {
      if (!ROLES.includes(role)) {
        res.status(409).json({
          message: `FAILED! 
          Role ${role} does not exist`,
        });
        return;
      }
    }
    next();
  },
};
