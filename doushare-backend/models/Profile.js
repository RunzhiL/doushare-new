const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  full_name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  phone_number: {
    type: String,
    maxlength: 50,
  },
  address: {
    type: String,
    maxlength: 255,
  },
});

module.exports = mongoose.model("Profile", profileSchema);