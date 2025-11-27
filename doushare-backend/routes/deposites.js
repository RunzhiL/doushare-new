const express = require("express");
const router = express.Router();
const Deposit = require("../models/Deposit");
const auth = require("../middleware/auth");

// Create a deposit record



// Get all deposit records
router.get("/", auth, async (req, res) => {
  try {
    const deposits = await Deposit.find().populate("borrow_id");
    res.json(deposits);
  } catch (err) { 
    res.status(500).json({ error: err.message });
  }
});

// Get a single deposit record
router.get("/:id", auth, async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id).populate("borrow_id");
    if (!deposit) return res.status(404).json({ error: "Not found" });
    res.json(deposit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update deposit status
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Deposit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a deposit record
router.delete("/:id", auth, async (req, res) => {
  try {
    await Deposit.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
