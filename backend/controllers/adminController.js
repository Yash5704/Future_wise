const { pool } = require('../config/pool');

const getAdminSettings = async () => {
  const [rows] = await pool.query('SELECT * FROM admin_settings LIMIT 1');
  
  if (rows.length === 0) {
    const [result] = await pool.query(
      'INSERT INTO admin_settings (admin_email) VALUES (?)',
      ['admin@example.com']
    );
    const [newSettings] = await pool.query('SELECT * FROM admin_settings WHERE id = ?', [result.insertId]);
    return newSettings[0];
  }
  
  return rows[0];
};

const updateAdminSettings = async (settings) => {
  const {
    adminEmail,
    maintenanceMode,
    userRegistration,
    emailNotifications,
    dataRetentionDays
  } = settings;
  
  await pool.query(
    `UPDATE admin_settings SET 
      admin_email = ?,
      maintenance_mode = ?,
      user_registration = ?,
      email_notifications = ?,
      data_retention_days = ?
    WHERE id = 1`,
    [
      adminEmail,
      maintenanceMode,
      userRegistration,
      emailNotifications,
      dataRetentionDays
    ]
  );
};

module.exports = {
  getAdminSettings,
  updateAdminSettings
};