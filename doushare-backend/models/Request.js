const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
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
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "cancelled"],
    default: "pending",
  },


  requested_from: {
    type: String,
    required: true,
  },
  requested_to: {
    type: String,
    required: true,
  },

  message: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Request", requestSchema);
