
const jwt = require("../utils/jwtUtils");

module.exports = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Suponiendo que el token se pasa como Bearer

  if (!token) {
    return res.status(403).json({ message: "Token de autorización no proporcionado" });
  }

  try {
    // Decodificar el token y obtener los datos del usuario
    const decoded = jwt.verifyToken(token);
    req.user = decoded; // Esto almacenará los datos del usuario en req.user
    next(); // Pasar al siguiente middleware o controlador
  } catch (err) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};
