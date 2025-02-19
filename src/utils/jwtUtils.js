require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

// Generar el token con id, name, email y estado
exports.generateToken = (userId, userName, userEmail, userState) => {
  return jwt.sign(
    { id: userId, name: userName, email: userEmail, state: userState }, // Payload
    secret, // Clave secreta
    { expiresIn: "24h" } // Expiración del token
  );
};

// Verificar el token y devolver el payload decodificado
exports.verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secret); // Verificar y decodificar el token
    return decoded; // Devuelve los datos decodificados del payload
  } catch (error) {
    throw new Error("Token no válido o expirado"); // Si el token no es válido o ha expirado
  }
};

// Middleware para proteger rutas y obtener el usuario autenticado
exports.authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extraer el token de las cabeceras

  if (!token) {
    return res.status(403).json({ message: "Acceso denegado, token no encontrado" });
  }

  try {
    const decoded = this.verifyToken(token); // Verificar y decodificar el token
    req.user = decoded; // Agregar los datos del usuario al request
    next(); // Continuar con la siguiente acción
  } catch (error) {
    return res.status(403).json({ message: "Token no válido o expirado" });
  }
};
