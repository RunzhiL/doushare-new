const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const Request = require("../models/Request");
const Borrow = require("../models/Borrow");
const Item = require("../models/Item");
const auth = require("../middleware/auth");

// Create a payment record (called when borrower enters payment page)

router.post("/", auth, async (req, res) => {
  try {
    const { request_id, amount, provider } = req.body;

    const payment = await Payment.create({
      request_id,
      amount,
      provider,
      status: "pending"
    });

    res.status(201).json(payment);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get the payment record for a specific request
router.get("/:requestId", auth, async (req, res) => {
  try {
    const payment = await Payment.findOne({ request_id: req.params.requestId });

    if (!payment)
      return res.status(404).json({ error: "Payment not found" });

    res.json(payment);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// After successful payment -> update Payment & create Borrow
router.patch("/:requestId", auth, async (req, res) => {
  try {
    const requestId = req.params.requestId;

    // Update payment status to "paid"
    const payment = await Payment.findOneAndUpdate(
      { request_id: requestId },
      { $set: { status: "paid" } },
      { new: true }
    );

    if (!payment)
      return res.status(404).json({ error: "Payment not found" });

    // Get the request details
    const request = await Request.findById(requestId).populate("item_id");

    if (!request)
      return res.status(404).json({ error: "Request not found" });

    // Create a Borrow record
    const borrow = await Borrow.create({
      request_id: request._id,
      item_id: request.item_id._id,
      borrower_id: request.borrower_id,
      lender_id: request.owner_id,
      start_date: request.requested_from,
      due_date: request.requested_to,
      state: "Active"
    });

    // Update item status to "borrowed"
    request.item_id.status = "borrowed";
    await request.item_id.save();

    res.json({
      message: "Payment completed & borrow created",
      payment,
      borrow
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
