const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");

const USER = db.user;
const ROLE = db.role;

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({
      message: `FAILED!
      Access Token Expired!`,
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: `FAILED!
        Not authourized`,
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  const user = await USER.findById(req.userId);

  if (!user) {
    res.status(404).json({
      message: `FAILED!
      User not found`,
    });
    return;
  }

  const $role = await ROLE.findById(user.role);

  if (!$role || $role.name !== "admin") {
    res.status(403).json({
      message: `FAILED!
     Require Admin ROLE`,
    });
    return;
  }
  req.userId = user.id;
  next();
};

const authJwt = {
  verifyToken,
  isAdmin,
};

module.exports = authJwt;
