const db = require("../config/db"); // Asegúrate de tener una conexión MySQL configurada con Promises

const Maganize = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM maganize");
    return rows;
  },
};

module.exports = Maganize;