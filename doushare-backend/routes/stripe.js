const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const auth = require("../middleware/auth");
const Borrow = require("../models/Borrow");
const Deposit = require("../models/Deposit");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Checkout Session
router.post("/create-checkout-session", auth, async (req, res) => {
  try {
    const { borrow_id } = req.body;

    // Load borrow + item
    const borrow = await Borrow.findById(borrow_id).populate("item_id");
    if (!borrow)
      return res.status(404).json({ error: "Borrow record not found" });

    const item = borrow.item_id;

    // Convert values
    const price = parseFloat(
      item.price_per_day?.$numberDecimal || item.price_per_day
    );
    const deposit = parseFloat(
      item.security_deposit?.$numberDecimal || item.security_deposit || 0
    );

    const start = new Date(borrow.start_date);
    const end = new Date(borrow.due_date);
    const days = Math.max(1, Math.ceil((end - start) / 86400000));

    const total = price * days + deposit;

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: item.title,
            },
            unit_amount: Math.round(total * 100), // cents
          },
          quantity: 1,
        },
      ],
      locale: "en",
      success_url: `http://localhost:5173/payment-success/${borrow_id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/payment/${borrow_id}`,
    });

    res.json({ url: session.url,
      sessionId: session.id });

  } catch (err) {
    console.error("Stripe Error:", err);
    res.status(500).json({ error: "Stripe session creation failed" });
  }
});

// create deposite
router.post("/save-deposit", auth, async (req, res) => {
  try {
    const { borrow_id, amount, payment_intent_id } = req.body;

    const deposit = await Deposit.create({
      borrow_id,
      amount,
      payment_intent_id,
      status: "held"
    });

    res.status(201).json(deposit);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Stripe session info
router.get("/session/:id", auth, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// deposite refund
router.put("/deposit/:id/refund", auth, async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id).populate("borrow_id");

    if (!deposit) return res.status(404).json({ error: "Deposit not found" });

    // Only lender can refund
    if (deposit.borrow_id.lender_id.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Stripe refund
    const refund = await stripe.refunds.create({
      payment_intent: deposit.payment_intent_id,
      amount: Number(deposit.amount) * 100,
    });

    deposit.status = "refunded";
    deposit.refund_id = refund.id;
    await deposit.save();

    res.json({ message: "Deposit refunded", refund });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
