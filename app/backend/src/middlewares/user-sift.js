const db = require("../models");
const ROLES = db.ROLES;
const USER = db.user;

module.exports = {
  checkDuplicateEmail: async (req, res, next) => {
    const {
      email
    } = req.body;

    const user = await USER.findOne({
      email,
    });

    if (user) {
      res.status(409).json({
        message: `FAILED!
         Email is already in use`
      });
      return;
    }

    next();
  },
  checkDuplicatePhoneNo: async (req, res, next) => {
    const {
      phoneno
    } = req.body;

    const user = await USER.findOne({
      phoneno,
    });

    if (user) {
      res.status(409).json({
        message: `FAILED!
        Phone No is already Registered`
      });
      return;
    }

    next();
  },

  checkRolesExisted: async (req, res, next) => {
    const {
      role
    } = req.body;

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
  }
}