const db = require("../models"),
  systemError = require("../utils/error.utils");
const USER = db.user;

module.exports = {
  async adminBoard(req, res) {
    let admin = await USER.findById(req.userId);
    if (!admin) {
      let e = systemError.NOT_FOUND_ERROR("Admin");
      res.status(e.status).json({
        message: e.message,
      });
      return;
    }
    res.status(200).json({
      userId: admin._id,
      role: "admin",
    });
  },
};
