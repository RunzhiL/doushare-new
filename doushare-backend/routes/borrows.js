const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Borrow = require("../models/Borrow");


// Create Borrow (system-created)

router.post("/", auth, async (req, res) => {
  try {
    const borrow = new Borrow(req.body);
    await borrow.save();
    res.status(201).json(borrow);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Borrower: Get my borrows

router.get("/my", auth, async (req, res) => {
  try {
    const records = await Borrow.find({ borrower_id: req.user.id })
      .populate("item_id");

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Lender: Get all I lent

router.get("/lent", auth, async (req, res) => {
  try {
    const records = await Borrow.find({ lender_id: req.user.id })
      .populate("item_id");

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get ONE Borrow by ID  (PaymentPage needs this)

router.get("/:id", auth, async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id)
      .populate("item_id");

    if (!borrow) return res.status(404).json({ error: "Borrow not found" });

    res.json(borrow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update borrow (payment, return, close)

router.put("/:id", auth, async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) return res.status(404).json({ error: "Borrow not found" });

    // Only borrower or lender can update
    if (
      borrow.borrower_id.toString() !== req.user.id &&
      borrow.lender_id.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Allow updating payment_status (super important!)
    if (req.body.payment_status) {
      borrow.payment_status = req.body.payment_status;
    }

    // Update return/close state
    if (req.body.state) {
      borrow.state = req.body.state;
    }

    if (req.body.returned_at) {
      borrow.returned_at = req.body.returned_at;
    }

    await borrow.save();
    res.json(borrow);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
