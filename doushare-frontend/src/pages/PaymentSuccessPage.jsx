import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../styles/PageContainer.css";

const PaymentSuccessPage = () => {
  const { borrowId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const finalizePayment = async () => {

      //  Get session_id from URL
      const params = new URLSearchParams(location.search);
      const sessionId = params.get("session_id");

      if (!sessionId) {
        alert("Missing Stripe session ID");
        return;
      }

      //  Retrieve Stripe Session from backend
      const sessionRes = await fetch(`http://localhost:3000/api/stripe/session/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const sessionData = await sessionRes.json();
      const payment_intent = sessionData.payment_intent;
      const amount_total = sessionData.amount_total / 100;

      //  Create Deposit record securely from backend
      await fetch("http://localhost:3000/api/stripe/save-deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          borrow_id: borrowId,
          amount: amount_total,
          payment_intent_id: payment_intent
        })
      });

      //  Update Borrow payment_status to completed
      await fetch(`http://localhost:3000/api/borrows/${borrowId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ payment_status: "completed" })
      });

      alert("Payment Successful!");

      // Redirect after success
      navigate("/my-borrows");
    };

    finalizePayment();
  }, [borrowId, navigate, location]);

  return (
    <div className="page-container">
      <h2>Finalizing Payment...</h2>
    </div>
  );
};

export default PaymentSuccessPage;
