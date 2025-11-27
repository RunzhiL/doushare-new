import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const PaymentPage = () => {
  const { borrowId } = useParams();  // route /payment/:borrowId
  const navigate = useNavigate();

  const [borrow, setBorrow] = useState(null);
  const [item, setItem] = useState(null);
  const [total, setTotal] = useState(0);

  // 1. load Borrow info
  useEffect(() => {
    if (!borrowId) {
      console.error("borrowId is missing in URL");
      return;
    }

    fetch(`http://localhost:3000/api/borrows/${borrowId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load borrow");
        return res.json();
      })
      .then((data) => {
        setBorrow(data);

        const itemData = data.item_id;
        setItem(itemData);

        const price = parseFloat(
          itemData.price_per_day?.$numberDecimal || itemData.price_per_day
        );
        const deposit = parseFloat(
          itemData.security_deposit?.$numberDecimal ||
            itemData.security_deposit ||
            0
        );

        const start = new Date(data.start_date);
        const end = new Date(data.due_date);
        const days = Math.max(
          1,
          Math.ceil((end - start) / (1000 * 60 * 60 * 24))
        );

        setTotal(price * days + deposit);
      })
      .catch((err) => console.error(" Payment load error:", err));
  }, [borrowId]);

  // Stripe pay
  const handleStripePay = async () => {
    const stripe = await stripePromise;

    const res = await fetch(
      "http://localhost:3000/api/stripe/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ borrow_id: borrowId })
      }
    );

    const data = await res.json();

    if (data.url) {
      // Step: jump to Stripe Checkout
      window.location.href = data.url;
    } else {
      alert("Payment failed");
    }
  };

  if (!borrow || !item) return <div className="page-container">Loading...</div>;

  return (
    <div className="page-container payment-container">
      <h2>Payment Page</h2>

      <h3>Item: {item.title}</h3>

      <p>
        Borrowing period:{" "}
        {borrow.start_date.slice(0, 10)} → {borrow.due_date.slice(0, 10)}
      </p>

      <h3>Total Payable: ${total}</h3>

      <button onClick={handleStripePay}>Proceed to Stripe Payment</button>
    </div>
  );
};

export default PaymentPage;
