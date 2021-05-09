const config = require("../config/auth.config"),
  db = require("../models"),
  systemError = require("../utils/error.utils");
const User = db.user;
const Role = db.role;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signin = async (req, res) => {
  const { username, password } = req.body;
  const admin_role = await Role.findOne({
    name: "admin",
  });

  const admin = await User.findOne({
    username,
    role: admin_role._id,
  });

  if (!admin) {
    res.status(404).json({
      message: "User Not Found",
    });
    return;
  }

  const valid = bcrypt.compareSync(password, admin.password);

  if (!valid) {
    let e = systemError.UNAUTHORIZED_ERROR();
    res.status(e.status).json({
      accesstoken: null,
      message: e.message,
    });
    return;
  }

  let token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: 86400,
  });

  const { _id: id, firstname, lastname, phoneno, userame } = user;

  res.status(200).json({
    id,
    firstname,
    lastname,
    username,
    phoneno,
    role: role.name,
    accessToken: token,
  });
};
