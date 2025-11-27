const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 160,
    },
    description: {
      type: String,
    },
    image_url: {
      type: String,
    },
    status: {
      type: String,
      enum: ["available", "requested", "borrowed", "unavailable"],
      default: "available",
    },
    price_per_day: {
      type: Number,
      required: true,
    },
    security_deposit: {
      type: Number,
      default: 0.0,
    },
    pickup_location: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Item", itemSchema);
