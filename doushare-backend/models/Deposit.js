const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema(
  {
    borrow_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Borrow",
      required: true,
    },
    amount: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "refunded", "held", "released"],
      default: "pending",
    },
    payment_intent_id: {
      type: String,
      required: true
    },
    refund_id: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deposit", depositSchema);
