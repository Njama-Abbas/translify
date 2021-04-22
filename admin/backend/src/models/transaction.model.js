const mongoose = require("mongoose");

const Transaction = mongoose.model(
  "Transaction",

  new mongoose.Schema({
    MerchantRequestID: {
      type: String,
    },
    CheckoutRequestID: {
      type: String,
    },
    Amount: {
      type: Number,
    },
    TrasactionType: {
      type: String,
      enum: ["C2B", "B2C"],
      required: "Whats the transaction type",
    },
    TransactionDate: {
      type: Date,
      default: new Date(),
    },
  })
);
