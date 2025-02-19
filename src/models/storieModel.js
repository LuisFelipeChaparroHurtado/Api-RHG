const db = require("../config/db"); // Asegúrate de tener una conexión MySQL configurada con Promises

const Storie = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM stories");
    return rows;
  },
};

module.exports = Storie;