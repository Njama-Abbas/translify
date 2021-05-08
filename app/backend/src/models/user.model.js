const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    firstname: String,
    lastname: String,
    phoneno: String,
    username: String,
    account_balance: {
      type: Number,
      default: 0,
    },
    password: String,
    verification: {
      status: {
        type: Boolean,
        default: false,
      },
      code: {
        type: Number,
      },
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: "Role is required",
    },
    account_status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED"],
      default: "ACTIVE",
    },
    refreshToken: {
      type: String,
      default: null,
    },
  })
);

module.exports = User;
