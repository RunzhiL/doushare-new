const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
  {
    request_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    borrower_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    due_date: {
      type: Date,
      required: true,
    },
    returned_at: {
      type: Date,
    },
    state: {
      type: String,
      enum: ["Active", "Overdue", "Closed"],
      default: "Active",
    },

    // Required for frontend to approve the borrow
    payment_status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    // Must allow default value 0 to avoid frontend errors during approval
    total_payable: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Borrow", borrowSchema);
