const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    request_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },
    amount: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    provider: {
      type: String,
      maxlength: 40,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
