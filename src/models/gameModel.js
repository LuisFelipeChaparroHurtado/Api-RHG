const db = require("../config/db"); // Asegúrate de tener una conexión MySQL configurada con Promises

const Game = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM games");
    return rows;
  },
};

module.exports = Game;