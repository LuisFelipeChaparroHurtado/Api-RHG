// controllers/authController.js
const {
  createUser,
  findByUsername,
  findById,
  updateUser,
  getUserByIdWithTrial,
  storeResetToken,
  findUserByEmail,
  updateSubscription
} = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("../utils/jwtUtils");
const moment = require("moment"); 

const nodemailer = require("nodemailer");

exports.register = async (req, res) => {
  const { first_name, last_name, email, phone, pass } = req.body;

  // Verificar si faltan datos específicos
  const missingFields = [];
  if (!first_name) missingFields.push("first_name");
  if (!last_name) missingFields.push("last_name");
  if (!email) missingFields.push("email");
  if (!phone) missingFields.push("phone");
  if (!pass) missingFields.push("pass");

  // Si faltan campos, devolver los campos faltantes en el mensaje
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Data is missing",
      missingFields: missingFields,
    });
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await findByUsername(email);
    if (existingUser) {
      // Cambiar esta condición
      return res.status(409).json({ message: "The user is already registered" });
    }

    // Crear el usuario
    const hashedPassword = await bcrypt.hash(pass, 10);
    const newUser = await createUser(
      first_name,
      last_name,
      email,
      phone,
      hashedPassword
    );

    res.status(200).json({ message: "Registered user", user: newUser });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ message: "The 'email' field is required" });
  }

  try {
    const user = await findByUsername(email);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.state === "0") {
      return res.status(403).json({
        message: "You need to subscribe to access",
        state: user.state,
      });
    }

    //console.log("Contraseña ingresada:", password);
    //console.log("Hash almacenado antes de modificar:", user.pass);

    // Convertir $2y a $2b si es necesario
    user.pass = user.pass.replace("$2y$", "$2b$");

    //console.log("Hash ajustado:", user.pass);

    const isPasswordCorrect = await bcrypt.compare(password, user.pass);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "There seems to be an error with your password. Please try again." });
    }

    const token = jwt.generateToken(
      user.id,
      user.first_name,
      user.email,
      user.state
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.updateUser = async (req, res) => {
  const userId = req.user.id; // Asumiendo que `req.user` contiene los datos del usuario extraídos del token
  const {
    first_name,
    last_name,
    pass,
    email,
    phone,
    address_line_no1,
    address_line_no2,
    country,
    state_of,
    city,
    zipcode,
  } = req.body;

  try {
    // Verificar si el usuario existe
    const user = await findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Crear un objeto de actualización con solo los campos proporcionados
    const updateData = {};
    if (first_name) updateData.first_name = first_name;
    if (last_name) updateData.last_name = last_name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address_line_no1) updateData.address_line_no1 = address_line_no1;
    if (address_line_no2) updateData.address_line_no2 = address_line_no2;
    if (country) updateData.country = country;
    if (state_of) updateData.state_of = state_of;
    if (city) updateData.city = city;
    if (zipcode) updateData.zipcode = zipcode;

    // Si se proporciona una contraseña, encriptarla antes de actualizar
    if (pass) {
      const hashedPassword = await bcrypt.hash(pass, 10);
      updateData.pass = hashedPassword;
    }

    // Verificar si no se pasaron campos para actualizar
    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "No data provided to update" });
    }

    // Actualizar los datos del usuario
    const updatedUser = await updateUser(userId, updateData);

    res
      .status(200)
      .json({ message: "Data updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating data:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.getUser = async (req, res) => {
  const userId = req.user.id; // Asumiendo que el usuario está autenticado y su ID se obtiene del token JWT

  try {
    // Buscar al usuario en la base de datos por su ID
    const user = await findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Devolver los datos del usuario (incluyendo su dirección, etc.)
    res.status(200).json({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      pass: user.password,
      phone: user.phone,
      address_line_no1: user.address_line_no1,
      address_line_no2: user.address_line_no2,
      country: user.country,
      state_of: user.state_of,
      state: user.state,
      city: user.city,
      zipcode: user.zipcode,
    });
  } catch (err) {
    console.error("Error getting user:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getDateTrial = async (req, res) => {
  const userId = req.user.id;

  try {
    // Obtener usuario con el campo 'trial'
    const user = await getUserByIdWithTrial(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calcular el tiempo restante de la prueba
    const trialDate = user.trial;
    const now = moment();
    const trialEnd = moment(trialDate);
    const diffDays = trialEnd.diff(now, 'days');

    // Si el periodo de prueba ha terminado
    let trialStatus = "Activo";
    if (diffDays < 0) {
      trialStatus = "Expirado";
    }

    res.status(200).json({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      trial: trialDate,
      trial_status: trialStatus, // Devolver el estado del periodo de prueba
      days_left: diffDays, // Devolver los días restantes
    });
  } catch (err) {
    console.error("Error getting user:", err);
    res.status(500).json({ error: err.message });
  }
};

// Recuperar contraseña - Verificar si el correo existe
exports.checkEmailExists = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "The 'email' field is required" });
  }

  try {
    const user = await findByUsername(email);

    if (!user) {
      return res.status(404).json({ message: "Unregistered email" });
    }

    res.status(200).json({ message: "Valid email" });
  } catch (err) {
    console.error("Error verifying email:", err);
    res.status(500).json({ error: "Error processing request" });
  }
};

// Restablecer contraseña
exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Incomplete data" });
  }

  try {
    const user = await findByUsername(email);

    if (!user) {
      return res.status(404).json({ message: "Unregistered email" });
    }

    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar la contraseña en la base de datos
    await updateUser(user.id, { pass: hashedPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ error: "Error processing request" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "The 'email' field is required" });
  }

  try {
    // Verificar si el usuario existe
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "Unregistered email" });
    }

    // Generar y almacenar token
    const token = await storeResetToken(user.id);
    const resetLink = `https://rainhopegames.com/reset_password.php?token=${token}`;

    // Configuración de Nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER, // Usa variables de entorno
        pass: process.env.SMTP_PASS,
      },
    });

    // Enviar el correo
    await transporter.sendMail({
      from: '"RainHopeGames" <info@rainhopegames.com>',
      to: email,
      subject: "Recover your password",
      text: `Click the following link to recover your password: ${resetLink}`,
      html: `<p>Click the following link to recover your password:</p><a href="${resetLink}">${resetLink}</a>`,
    });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).json({ error: "Error processing request" });
  }
};

exports.updateSubscription = async (req, res) => {
  const userId = req.user.id; // ID del usuario autenticado

  try {
    const user = await findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fecha actual en formato SQL
    const currentDate = moment().format("YYYY-MM-DD HH:mm:ss"); 
    // Sumar 30 días a la fecha actual
    const newTrialDate = moment().add(30, "days").format("YYYY-MM-DD HH:mm:ss");

    // Actualizar los campos en la base de datos
    await updateSubscription(userId, 1, newTrialDate, currentDate, 1);

    res.status(200).json({ 
      message: "Subscription updated successfully", 
      date: currentDate, 
      trial: newTrialDate, 
      state: 1,
      pay:1
    });

  } catch (err) {
    console.error("Error updating subscription:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};



