const Kid = require("../models/kidModel");

// Obtener todos los registros de la tabla 'kids'
exports.getKids = async (req, res) => {
  try {
    const kids = await Kid.getAll();
    res.json(kids);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un registro específico por ID
exports.getKidById = async (req, res) => {
  const { id_kid } = req.params;
  try {
    const kid = await Kid.findById(id_kid);
    if (!kid) return res.status(404).json({ error: "Kid not found" });
    res.json(kid);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear un nuevo registro en la tabla 'kids'
exports.createKid = async (req, res) => {
  const { name_kid, last_name, id_parent, fecha_kid, rango, avatar, color } = req.body;

  if (!name_kid || !last_name || !id_parent || !fecha_kid || !rango || !avatar || !color) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const id = await Kid.create({
      name_kid,
      last_name,
      id_parent,
      fecha_kid,
      rango,
      avatar,
      color,
    });
    res.status(200).json({ message: "Kid created successfully", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar un registro existente en la tabla 'kids'
exports.updateKid = async (req, res) => {
  const { id_kid } = req.params;
  const { name_kid, last_name, id_parent, fecha_kid, rango, avatar, color } = req.body;

  if (!name_kid || !last_name || !id_parent || !fecha_kid || !rango || !avatar || !color) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const affectedRows = await Kid.update(id_kid, {
      name_kid,
      last_name,
      id_parent,
      fecha_kid,
      rango,
      avatar,
      color,
    });
    if (affectedRows === 0)
      return res.status(404).json({ error: "Kid not found" });
    res.json({ message: "Kid updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un registro de la tabla 'kids'
exports.deleteKid = async (req, res) => {
  const { id_kid } = req.params;

  try {
    const affectedRows = await Kid.delete(id_kid);
    if (affectedRows === 0)
      return res.status(404).json({ error: "Kid not found" });
    res.json({ message: "Kid deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener todos los niños de un usuario específico (por id_parent)
exports.getKidsByParent = async (req, res) => {
  const { id_parent } = req.params;

  if (!id_parent) {
    return res.status(400).json({ error: "Parent ID is required" });
  }

  try {
    const kids = await Kid.findByParentId(id_parent);

    if (!kids || kids.length === 0) {
      return res
        .status(404)
        .json({ error: "No kids found for the specified parent" });
    }

    res.status(200).json(kids);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
