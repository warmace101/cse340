const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

module.exports = {getClassifications}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
* Get vehicle info by inv_id
* ************************** */
async function getVehicleByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getVehicleByInvId error " + error)
  }
}

/* ***************************
* Example model function
* ************************** */
async function getInventoryByInvId(inv_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory WHERE inv_id = $1",
      [inv_id]
    );
    console.log(data.rows[0]);
    return data.rows[0];
  } catch (error) {
    throw error;
  }
}

/* *****************************
*   Add new classification
* *************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    const result = await pool.query(sql, [classification_name]);
    return result;
  } catch (error) {
    console.error("DB error:", error);
    return null;
  }
}

/* *****************************
*   Add new inventory item
* *************************** */
async function addInventory(
  classification_id, inv_make, inv_model, inv_year, inv_description,
  inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
) {
  try {
    const sql = `INSERT INTO inventory 
      (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`;
    const data = [
      classification_id, inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    ];
    const result = await pool.query(sql, data);
    return result;
  } catch (error) {
    console.error("DB error:", error);
    return null;
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getVehicleByInvId, getInventoryByInvId, addClassification, addInventory };