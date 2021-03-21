const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  const admin_role = await Role.findOne({
    name: "admin",
  });

  const admin = await User.findOne({
    email,
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
    return res.status(401).json({
      accessToken: null,
      message: "Invalid Login Details",
    });
  }

  let token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: 86400,
  });

  const { _id: id, firstname, lastname, phoneno, email } = user;

  res.status(200).json({
    id,
    firstname,
    lastname,
    email,
    phoneno,
    role: role.name,
    accessToken: token,
  });
};
