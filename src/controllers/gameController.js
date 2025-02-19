const Game = require("../models/gameModel");


// Obtener todos los registros de la tabla 'games'
exports.getGames = async (req, res) => {
  try {
    const games = await Game.getAll();
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
