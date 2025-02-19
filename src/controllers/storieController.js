const Storie = require("../models/storieModel");



// Obtener todos los registros de la tabla 'games'
exports.getStories = async (req, res) => {
  try {
    const stories = await Storie.getAll();
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
