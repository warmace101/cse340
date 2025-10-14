const pool = require("../database/");

async function addMessage(account_id, message_text) {
  const sql = `
    INSERT INTO messages (account_id, message_text)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const data = await pool.query(sql, [account_id, message_text]);
  return data.rows[0];
}

async function getAllMessages() {
  const sql = `
    SELECT m.*, a.account_firstname, a.account_lastname
    FROM messages m
    JOIN account a ON m.account_id = a.account_id
    ORDER BY m.created_at DESC;
  `;
  const data = await pool.query(sql);
  return data.rows;
}

module.exports = { addMessage, getAllMessages };