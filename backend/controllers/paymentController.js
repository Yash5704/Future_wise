const db = require("../config/db");

const submitManualPayment = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized: User not authenticated." });
  }

  const userId = req.user.id;
  const transactionId = req.body.transactionId?.toString().trim();  // 👈 ensure it's a string
  const plan = req.body.plan?.toString().trim();                    // 👈 ensure it's a string
  const screenshot = req.file?.filename;

  console.log("Transaction ID:", transactionId);
  console.log("Plan:", plan);

  if (!plan || !["1_month", "3_months", "12_months"].includes(plan)) {
    return res.status(400).json({ message: "Invalid or missing plan." });
  }

  try {
    await db.promise().query(
      "INSERT INTO payments (user_id, method, transaction_id, screenshot, plan, status) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, "upi", transactionId || null, screenshot || null, plan, "pending"]
    );

    res.json({ message: "Payment submitted for manual approval." });
  } catch (error) {
    console.error("Payment submission error:", error);
    res.status(500).json({ message: "Server error during payment submission." });
  }
};

const getPendingPayments = async (req, res) => {
  try {
    const [results] = await db.promise().query(
      `SELECT payments.*, users.email, users.name 
       FROM payments 
       JOIN users ON payments.user_id = users.id 
       WHERE payments.status = 'pending'`
    );
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching payments" });
  }
};

const updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log(`Updating payment with id: ${id}, status: ${status}`);

  const validStatuses = ["approved", "rejected", "pending"];
if (!validStatuses.includes(status)) {
  return res.status(400).json({ message: "Invalid status value." });
}


  try {
    const [[payment]] = await db.promise().query("SELECT * FROM payments WHERE id = ?", [id]);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    await db.promise().query("UPDATE payments SET status = ? WHERE id = ?", [status, id]);
if (status === "approved") {
  let expiryDate = new Date();

  if (payment.plan === "1_month") {
    expiryDate.setMonth(expiryDate.getMonth() + 1);
  } else if (payment.plan === "3_months") {
    expiryDate.setMonth(expiryDate.getMonth() + 3);
  } else if (payment.plan === "12_months") {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  }

  // Update user's premium status
  await db.promise().query(
    "UPDATE users SET is_premium = 1, premium_expires_at = ? WHERE id = ?",
    [expiryDate, payment.user_id]
  );

  // ✅ Update payments table with expiry
  await db.promise().query(
    "UPDATE payments SET premium_expiry = ? WHERE id = ?",
    [expiryDate, id]
  );
}


    res.json({ message: `Payment ${status}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating status" });
  }
};

const getUserPayments = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user.id;

  try {
    const [results] = await db.promise().query(
      `SELECT id, method, transaction_id, screenshot, plan, status, created_at, premium_expiry 
       FROM payments 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(results);
  } catch (error) {
    console.error("Fetch payment history error:", error);
    res.status(500).json({ message: "Error fetching payment history" });
  }
};


module.exports = {
  submitManualPayment,
  getPendingPayments,
  updatePaymentStatus,
  getUserPayments,
};
