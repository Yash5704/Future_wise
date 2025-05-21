import { useEffect, useState } from "react";
import axios from "axios";
import "../style files/PaymentHistory.css"; // optional

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5001/api/payment/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(res.data);
      } catch (err) {
        console.error("Error fetching payments:", err);
      }
      setLoading(false);
    };

    fetchPayments();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="payment-history-container">
      <h2>Your Payment History</h2>
      {payments.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table className="payment-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Date</th>
              <th>Screenshot</th>
              <th>Premium Expires</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.transaction_id || "N/A"}</td>
                <td>{payment.plan ? payment.plan.replace("_", " ") : "N/A"}</td>
                <td>{payment.status}</td>
                <td>{new Date(payment.created_at).toLocaleString()}</td>
                <td>
                  {payment.screenshot ? (
                    <a
                      href={`http://localhost:5001/uploads/${payment.screenshot}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  {payment.premium_expiry
                    ? new Date(payment.premium_expiry).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      )}
    </div>
  );
};

export default PaymentHistory
