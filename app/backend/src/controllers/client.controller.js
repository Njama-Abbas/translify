const db = require("../models");
const User = db.user;
const Role = db.role;

module.exports = {
  get: async (req, res) => {
    const id = req.headers.clientid;
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({
        message: "Client Not Found",
      });
      return;
    }
    const clientRole = await Role.findOne({
      name: "client",
    });

    res.status(200).json({
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      role: clientRole.name,
    });
  },
};
