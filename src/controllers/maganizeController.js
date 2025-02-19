const Maganize = require("../models/maganizeModel");



// Obtener todos los registros de la tabla 'maganize'
exports.getMaganize = async (req, res) => {
  try {
    const maganize = await Maganize.getAll();
    res.json(maganize);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
