const promisePool = require("../config/db");
const crypto = require("crypto");

// Función para crear un nuevo usuario
const createUser = async (first_name, last_name, email, phone, pass) => {
  try {
    // Obtener la fecha y hora actual en formato 'YYYY-MM-DD HH:MM:SS'
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    const stateGame = 1;
    const pay = 0;

    const futureDate = new Date(currentDate);

    futureDate.setDate(futureDate.getDate() + 3);
    const trial = futureDate.toISOString().slice(0, 19).replace("T", " ");

    const [rows] = await promisePool.execute(
      "INSERT INTO users (first_name, last_name, email, phone, pass, state, date, trial, pay) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [first_name, last_name, email, phone, pass, stateGame, currentDate, trial, pay]
    );

    return rows;
  } catch (err) {
    console.error("Error al crear el usuario:", err);
    throw err;
  }
};

// Función para buscar un usuario por su email
const findByUsername = async (email) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    // Si no se encuentra ningún usuario, retornar null
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error("Error al buscar el usuario:", err);
    throw err;
  }
};

const updateUser = async (id, updateData) => {
  // Filtrar los campos que han sido proporcionados
  const fieldsToUpdate = [];
  const values = [];

  // Verificar qué campos existen en updateData y agregar solo los campos presentes
  if (updateData.first_name) {
    fieldsToUpdate.push("first_name = ?");
    values.push(updateData.first_name);
  }
  if (updateData.pass) {
    fieldsToUpdate.push("pass = ?");
    values.push(updateData.pass);
  }
  if (updateData.last_name) {
    fieldsToUpdate.push("last_name = ?");
    values.push(updateData.last_name);
  }
  if (updateData.email) {
    fieldsToUpdate.push("email = ?");
    values.push(updateData.email);
  }
  if (updateData.phone) {
    fieldsToUpdate.push("phone = ?");
    values.push(updateData.phone);
  }
  if (updateData.address_line_no1) {
    fieldsToUpdate.push("address_line_no1 = ?");
    values.push(updateData.address_line_no1);
  }
  if (updateData.address_line_no2) {
    fieldsToUpdate.push("address_line_no2 = ?");
    values.push(updateData.address_line_no2);
  }
  if (updateData.country) {
    fieldsToUpdate.push("country = ?");
    values.push(updateData.country);
  }
  if (updateData.state_of) {
    fieldsToUpdate.push("state_of = ?");
    values.push(updateData.state_of);
  }
  if (updateData.city) {
    fieldsToUpdate.push("city = ?");
    values.push(updateData.city);
  }
  if (updateData.zipcode) {
    fieldsToUpdate.push("zipcode = ?");
    values.push(updateData.zipcode);
  }

  // Si no se proporcionó ningún campo para actualizar, se lanza un error
  if (fieldsToUpdate.length === 0) {
    throw new Error("No se proporcionaron datos para actualizar");
  }

  // Construir la consulta SQL dinámica
  const query = `
    UPDATE users 
    SET ${fieldsToUpdate.join(", ")} 
    WHERE id = ?
  `;

  // Ejecutar la consulta, agregando el id al final
  values.push(id);
  const [result] = await promisePool.execute(query, values);

  return result; // Puedes retornar el resultado de la consulta o buscar el usuario actualizado si lo deseas
};


// Función para buscar un usuario por su ID
const findById = async (id) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    // Si no se encuentra ningún usuario, retornar null
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error("Error al buscar el usuario por ID:", err);
    throw err;
  }
};

const getUserByIdWithTrial = async (id) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT id, first_name, trial FROM users WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error("Error al obtener el usuario por ID con el campo trial:", err);
    throw err;
  }
};

const emailExists = async (email) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT COUNT(*) as count FROM users WHERE email = ?",
      [email]
    );

    return rows[0].count > 0;
  } catch (err) {
    console.error("Error al verificar el correo:", err);
    throw err;
  }
};

// Función para actualizar la contraseña de un usuario
const updatePassword = async (email, newPassword) => {
  try {
    const [result] = await promisePool.execute(
      "UPDATE users SET pass = ? WHERE email = ?",
      [newPassword, email]
    );

    return result;
  } catch (err) {
    console.error("Error al actualizar la contraseña:", err);
    throw err;
  }
};

const findUserByEmail = async (email) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error("Error al buscar usuario:", err);
    throw err;
  }
};

const storeResetToken = async (userId) => {
  try {
    const token = crypto.randomBytes(50).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await promisePool.execute(
      "INSERT INTO password_resets (user_id, token, expiry) VALUES (?, ?, ?)",
      [userId, token, expiry]
    );

    return token;
  } catch (err) {
    console.error("Error al guardar token:", err);
    throw err;
  }
};

const updateSubscription = async (id, state, trial, date, pay) => {
  try {
    const [result] = await promisePool.execute(
      "UPDATE users SET state = ?, trial = ?, date = ?, pay = ? WHERE id = ?",
      [state, trial, date, pay, id]
    );

    return result;
  } catch (err) {
    console.error("Error al actualizar la suscripción:", err);
    throw err;
  }
};



module.exports = { createUser, findByUsername, updateUser, findById, getUserByIdWithTrial, emailExists, updatePassword, findUserByEmail, storeResetToken, updateSubscription };
