const pool = require("../config/db");

const Logro = {
  // ===================================================
  // INSERTAR TIEMPO DEL MAPA
  // ===================================================
  async insertTiempoMapa(usuario_id, fecha_inicio, fecha_fin, tiempo) {
    console.log("MODELO insertTiempoMapa:", {
      usuario_id,
      fecha_inicio,
      fecha_fin,
      tiempo,
    });

    const [resultado] = await pool.query(
      `
      INSERT INTO tiempo_mapa
        (usuario_id, fecha_inicio, fecha_fin, tiempo)
      VALUES (?, ?, ?, ?)
      `,
      [usuario_id, fecha_inicio, fecha_fin, tiempo]
    );

    if (resultado.affectedRows !== 1) {
      console.error("Error al insertar tiempo de mapa");
      return false;
    }

    return true;
  },

  // ===================================================
  // OBTENER MEJORES TIEMPOS DEL MAPA
  // ===================================================
  async getTiemposMapa(usuario_id) {
    const sql = `
      SELECT 
        MIN(tiempo_id) AS tiempo_id,
        usuario_id,
        tiempo,
        MIN(fecha_inicio) AS fecha_inicio,
        MAX(fecha_fin) AS fecha_fin
      FROM tiempo_mapa
      WHERE usuario_id = ?
      GROUP BY usuario_id, tiempo
      ORDER BY tiempo ASC
      LIMIT 10
    `;

    const [tiempos] = await pool.query(sql, [usuario_id]);
    return tiempos;
  },

  // ===================================================
  // OBTENER ÚLTIMO (MEJOR) TIEMPO
  // ===================================================
  async getUltimoTiempoMapa(usuario_id) {
    const sql = `
      SELECT 
        MIN(tiempo_id) AS tiempo_id,
        usuario_id,
        tiempo,
        MIN(fecha_inicio) AS fecha_inicio,
        MIN(fecha_fin) AS fecha_fin
      FROM tiempo_mapa
      WHERE usuario_id = ?
      GROUP BY tiempo
      ORDER BY tiempo ASC
      LIMIT 1
    `;

    const [tiempos] = await pool.query(sql, [usuario_id]);
    return tiempos;
  },
};

module.exports = Logro;
