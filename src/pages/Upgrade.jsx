import React, { useState } from "react";
import axios from "axios";
import "../style-files/Upgrade.css";

const Upgrade = () => {
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");


  const handleFileChange = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const handleSubmit = async () => {
  if (!transactionId || !screenshot) {
    return setMessage("Please enter transaction ID or upload a screenshot.");
  }

  if (!selectedPlan) {
    return setMessage("Please select a plan.");
  }

  const formData = new FormData();
  formData.append("transactionId", transactionId);
  formData.append("plan", selectedPlan);
  if (screenshot) formData.append("screenshot", screenshot);

  const token = localStorage.getItem("token");

  setLoading(true);
  try {
    const res = await axios.post("http://localhost:5001/api/payment/manual", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      },
    });
    setMessage(res.data.message);
  } catch (err) {
    console.error(err);
    setMessage("Failed to submit payment. Try again.");
  }
  setLoading(false);
};


  return (
    <div className="upgrade-container">
      <h2>Upgrade to Premium</h2>
      <p>Scan the QR or pay via UPI ID:</p>

      <img src="/images/upi-qr.png" alt="QR Code" className="qr-image" />

      <div className="plan-selection">
        <label>Select Plan:</label>
        <div className="plan-cards">
          <div
            className={`plan-card ${selectedPlan === "1_month" ? "selected" : ""}`}
            onClick={() => setSelectedPlan("1_month")}
          >
            <p>₹99</p>
            <p>1 Month</p>
          </div>
          <div
            className={`plan-card ${selectedPlan === "3_months" ? "selected" : ""}`}
            onClick={() => setSelectedPlan("3_months")}
          >
            <p>₹249</p>
            <p>3 Months</p>
          </div>
          <div
            className={`plan-card ${selectedPlan === "12_months" ? "selected" : ""}`}
            onClick={() => setSelectedPlan("12_months")}
          >
            <p>₹799</p>
            <p>1 Year</p>
          </div>
        </div>
        {selectedPlan && (
          <p style={{ marginTop: "5px", color: "#555" }}>
            {selectedPlan === "1_month" && "You selected ₹99 for 1 Month"}
            {selectedPlan === "3_months" && "You selected ₹249 for 3 Months"}
            {selectedPlan === "12_months" && "You selected ₹799 for 1 Year"}
          </p>
        )}
      </div>

      <div className="upi-id-box">
        <span>yashpatel07052004@okhdfcbank</span>
        <button onClick={() => navigator.clipboard.writeText("yashpatel07052004@okhdfcbank")}>
          Copy
        </button>
      </div>

      <input
        type="text"
        placeholder="Enter UPI Transaction ID"
        value={transactionId}
        onChange={(e) => setTransactionId(e.target.value)}
      />

      <label>Upload Payment Screenshot (optional):</label>
      <input type="file" onChange={handleFileChange} accept="image/*" />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit for Approval"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Upgrade;
