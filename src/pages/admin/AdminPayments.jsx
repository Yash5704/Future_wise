import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../style files/AdminPayments.css";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5001/api/payment/pending", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(res.data);
    } catch (err) {
      setError("Error fetching payments. Please try again.");
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (id, status) => {
    const confirm = window.confirm(`Are you sure you want to ${status} this payment?`);
    if (!confirm) return;

    setSuccess(null);
    setError(null);
    setUpdatingId(id);

    setPayments((prev) => prev.filter((payment) => payment.id !== id)); // Optimistic update

    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:5001/api/payment/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (status === "approved") {
        localStorage.setItem("isPremium", "true");
      }

      setSuccess(`Payment ${status} successfully.`);
    } catch (err) {
      console.error("Failed to update status", err);
      setError("Failed to update payment status. Please try again.");
      fetchPayments(); // Reload if failed
    }

    setUpdatingId(null);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) return <p className="loading-message">Loading payments...</p>;

  return (
    <div className="admin-payments-container">
      <h2>Manual Payment Approvals</h2>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      {payments.length === 0 ? (
        <p>No pending payments.</p>
      ) : (
        payments.map((payment) => (
          <div key={payment.id} className="payment-card">
            <p><strong>User:</strong> {payment.name} ({payment.email})</p>
            <p><strong>Transaction ID:</strong> {payment.transaction_id || "N/A"}</p>
            <p><strong>Plan:</strong> {payment.plan ? payment.plan.replace("_", " ") : "N/A"}</p>

            {payment.screenshot && (
              <img
                src={`http://localhost:5001/uploads/payments/${payment.screenshot}`}
                alt="Payment Screenshot"
                className="screenshot-img"
              />
            )}

            <div className="actions">
              <button
                onClick={() => handleStatusUpdate(payment.id, "approved")}
                disabled={updatingId === payment.id}
              >
                {updatingId === payment.id ? "Approving..." : "Approve"}
              </button>

              <button
                onClick={() => handleStatusUpdate(payment.id, "rejected")}
                className="reject"
                disabled={updatingId === payment.id}
              >
                {updatingId === payment.id ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminPayments;
