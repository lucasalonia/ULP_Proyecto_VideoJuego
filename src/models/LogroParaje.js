const pool = require("../config/db");

const LogroParaje = {
  async guardar({ usuario_id, paraje_id, fecha_inicio, fecha_fin, tiempo }) {
    const [result] = await pool.query(
      `INSERT IGNORE INTO logro (usuario_id, paraje_id, fecha_inicio, fecha_fin, tiempo)
       VALUES (?, ?, ?, ?, ?);`,
      [usuario_id, paraje_id, fecha_inicio, fecha_fin, tiempo]
    );

    return result.insertId || 0;
  },

  // Parajes completados por un usuario en un departamento (IDs)
  async getParajesCompletadosPorUsuarioYDepto(usuarioId, deptoId) {
    const [rows] = await pool.query(
      `SELECT l.paraje_id
       FROM logro l
       INNER JOIN paraje p ON p.id = l.paraje_id
       WHERE l.usuario_id = ? AND p.departamento_id = ?
       ORDER BY p.id`,
      [usuarioId, deptoId]
    );
    return rows.map((r) => r.paraje_id);
  },

  async getParajesCompletadosPorUsuarioYDeptoNombre(usuarioId, deptoId) {
    const [rows] = await pool.query(
      `SELECT p.nombre
       FROM logro l
       INNER JOIN paraje p ON p.id = l.paraje_id
       WHERE l.usuario_id = ? AND p.departamento_id = ?
       ORDER BY p.id`,
      [usuarioId, deptoId]
    );
    return rows.map((r) => r.nombre);
  },

  async getParajesCompletadosUltimosTres(usuarioId) {
    const [rows] = await pool.query(
      `SELECT p.nombre
       FROM logro l
       INNER JOIN paraje p ON p.id = l.paraje_id
       WHERE l.usuario_id = ?
       ORDER BY fecha_fin DESC
       LIMIT 3;`,
      [usuarioId]
    );
    return rows.map((r) => r.nombre);
  },

  // ==========================================================
  // ✅ NUEVO: traer logros (paraje_id + tiempo) por depto
  // ==========================================================
  async getLogrosPorUsuarioYDepto(usuarioId, deptoId) {
    const [rows] = await pool.query(
      `SELECT l.paraje_id, l.tiempo
       FROM logro l
       INNER JOIN paraje p ON p.id = l.paraje_id
       WHERE l.usuario_id = ? AND p.departamento_id = ?
       ORDER BY p.id`,
      [usuarioId, deptoId]
    );

    return rows; // [{ paraje_id: 1, tiempo: 8 }, ...]
  },

  // ==========================================================
  // ✅ NUEVO: borrar logros del depto (para reiniciar)
  // ==========================================================
  async borrarPorUsuarioYDepto(usuarioId, deptoId) {
    const [result] = await pool.query(
      `DELETE l
       FROM logro l
       INNER JOIN paraje p ON p.id = l.paraje_id
       WHERE l.usuario_id = ? AND p.departamento_id = ?`,
      [usuarioId, deptoId]
    );

    return result.affectedRows || 0;
  },
};

module.exports = LogroParaje;
