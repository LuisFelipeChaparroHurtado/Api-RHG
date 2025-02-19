const db = require("../config/db"); // Asegúrate de tener una conexión MySQL configurada con Promises

const Kid = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM kids");
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM kids WHERE id_kid = ?", [id]);
    return rows[0];
  },

  create: async (data) => {
    const [result] = await db.query("INSERT INTO kids SET ?", data);
    return result.insertId;
  },

  update: async (id_kid, data) => {
    const [result] = await db.query("UPDATE kids SET ? WHERE id_kid = ?", [
      data,
      id_kid,
    ]);
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query("DELETE FROM kids WHERE id_kid = ?", [id]);
    return result.affectedRows;
  },
  
  findByParentId: async (id_parent) => {
    const [rows] = await db.query("SELECT * FROM kids WHERE id_parent = ?", [
      id_parent,
    ]);
    return rows;
  },
};

module.exports = Kid;
