const pool = require("../config/db");

const Usuario = {
  async findByPk(userId) {
        const query = `
            SELECT 
                usuario_id, 
                nombre, 
                mail, 
                password_hash,
                rol,
                imagen_perfil
            FROM usuario
            WHERE usuario_id = ?
        `;

        const [[usuario]] = await pool.query(query, [userId]);

        return usuario || null; 
    },

  async findUserByMail(mail) {
    const query = `
            SELECT 
                usuario_id, 
                nombre, 
                mail, 
                password_hash, 
                rol,
                imagen_perfil,
                nombre 
            FROM usuario
            WHERE mail = ?
        `;

    const [[usuario]] = await pool.query(query, [mail]);

    return usuario;
  },

  async getRoleByUserId(userId) {
    const query = "SELECT rol FROM usuario WHERE usuario_id = ?";
    const [[result]] = await pool.query(query, [userId]);
    return result ? result.rol : null;
  },

  async createUser(nombre, mail, passwordHash, rol, imagenPerfil) {

    const insertQuery = `
        INSERT INTO usuario (nombre, mail, password_hash, rol, imagen_perfil) 
        VALUES (?, ?, ?, ?, ?)
    `;

    const [insertResult] = await pool.query(insertQuery, [
      nombre,
      mail,
      passwordHash,
      rol,
      imagenPerfil,
    ]);

    const newUserId = insertResult.insertId;

    const selectQuery = `
        SELECT usuario_id, nombre, mail, rol, imagen_perfil
        FROM usuario 
        WHERE usuario_id = ?
    `;

    const [userRows] = await pool.query(selectQuery, [newUserId]);

    if (userRows.length > 0) {
      return userRows[0];
    } else {
      return null;
    }
  },

  async updatePassword(userId, newPasswordHash) {
    const updateQuery = `
        UPDATE usuario 
        SET password_hash = ? 
        WHERE usuario_id = ?
    `;
    const [updateResult] = await pool.query(updateQuery, [newPasswordHash, userId]);
    return updateResult.affectedRows > 0;
  },
  async updateNickname(userId, newNickname) {
    const updateQuery = `
        UPDATE usuario 
        SET nombre = ? 
        WHERE usuario_id = ?
    `;
    const [updateResult] = await pool.query(updateQuery, [newNickname, userId]);
    return updateResult.affectedRows > 0;
  }
};

module.exports = Usuario;
