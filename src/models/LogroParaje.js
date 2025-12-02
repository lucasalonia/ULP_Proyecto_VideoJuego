const pool = require("../config/db");

const LogroParaje = {

  async guardar({ usuario_id, paraje_id, fecha_inicio, fecha_fin, tiempo }) {
    const [result] = await pool.query(
      `INSERT INTO logro (usuario_id, paraje_id, fecha_inicio, fecha_fin, tiempo)
       VALUES (?, ?, ?, ?, ?);`,
      [usuario_id, paraje_id, fecha_inicio, fecha_fin, tiempo]
    );

    return result.insertId;
  },

// Parajes completados por un usuario en un departamento
  async getParajesCompletadosPorUsuarioYDepto(usuarioId, deptoId) {
    const [rows] = await pool.query(
      `SELECT l.paraje_id
       FROM logro l
       INNER JOIN paraje p ON p.id = l.paraje_id
       WHERE l.usuario_id = ? AND p.departamento_id = ?
       ORDER BY p.id`,
      [usuarioId, deptoId]
    );
    return rows.map(r => r.paraje_id);
  },
};
module.exports = LogroParaje;
