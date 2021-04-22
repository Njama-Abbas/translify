const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const USER = db.user;
const ROLE = db.role;

module.exports = {
  verifyToken: async (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
      return res.status(403).json({
        message: "No token provided!"
      });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Unauthourized"
        });
      }
      req.userId = decoded.id;
      next();
    });
  },

  verifyStatus: async (req, res, next) => {
    const user = await USER.findOne({
      _id: req.userId,
    });

    if (!user) {
      res.status(404).json({
        message: "user not found",
      });
      return;
    }

    if (!user.verification.status) {
      res.status(403).json({
        message: "You are Not authorized to view this page. Please Verify your account",
      });
      return;
    }
    next();
  },

  isClient: async (req, res, next) => {
    const user = await USER.findOne({
      _id: req.userId,
    });

    if (!user) {
      res.status(404).json({
        message: "user not found",
      });
      return;
    }

    const client_role = await ROLE.findOne({
      _id: user.role,
    });

    if (!client_role) {
      res.status(404).json({
        message: "We Could'nt Find Your role",
      });
      return;
    }

    if (client_role.name !== "client") {
      res.status(403).json({
        message: "You Require to have a Client Role to access the page",
      });
      return;
    }
    next();
  },

  isDriver: async (req, res, next) => {
    const user = await USER.findOne({
      _id: req.userId,
    });

    if (!user) {
      res.status(404).json({
        message: "user not found",
      });
      return;
    }

    const driver_role = await ROLE.findOne({
      _id: user.role,
    });

    if (!driver_role) {
      res.status(404).json({
        message: "We Could'nt Find Your role",
      });
      return;
    }

    if (driver_role.name !== "driver") {
      res.status(403).json({
        message: "You Require to have a Driver Role to access the page",
      });
      return;
    }

    next();
  },
};