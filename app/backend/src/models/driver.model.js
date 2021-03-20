const mongoose = require("mongoose");

const Driver = mongoose.model(
  "Driver",
  new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: "UserId is required",
    },
    oncall: {
      type: Boolean,
      default: true,
    },
    reserved: {
      type: Boolean,
      default: false,
    },
    truckno: String,
    dlno: String,
    approval_status: {
      type: String,
      enum: ["P", "D", "A"],
      default: "P",
    },
    current_location_id: {
      type: String,
    },
    address: {
      place_name: String,
      place_id: String,
    },
    dateOfReg: {
      type: Date,
      default: new Date(),
    },
  })
);

module.exports = Driver;
