const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Profile = require("../models/Profile");


// Get the current user's profile
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user_id: req.user.id });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Create or update the current user's profile (PUT = full update)
router.put("/me", auth, async (req, res) => {
  try {
    const { full_name, phone_number, address } = req.body;

    const updated = await Profile.findOneAndUpdate(
      { user_id: req.user.id },
      {
        user_id: req.user.id,
        full_name,
        phone_number,
        address,
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
