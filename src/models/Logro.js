const pool = require("../config/db");

const Logro = {
    async insertTiempoMapa(tiempo_mapa) {
        const { id, fecha_inicio, fecha_fin, tiempo } = tiempo_mapa;
        const [tiempo_resultado] = await pool.query(
            "INSERT INTO`tiempo_mapa`(`usuario_id`, `fecha_inicio`, `fecha_fin`, `tiempo`) VALUES (?,?,?,?)",
            [id, fecha_inicio, fecha_fin, tiempo])
        if (tiempo_resultado.affectedRows !== 1) {
            console.error("Error al insertar Tiempo mapa.");
            return false;
        }

    },

    async getTiemposMapa(id) {
        const sql = `
    SELECT 
      MIN(tiempo_id) AS tiempo_id,
      usuario_id,
      tiempo,
      fecha_inicio,
      fecha_fin
    FROM tiempo_mapa
    WHERE usuario_id = ?
    GROUP BY tiempo
    ORDER BY tiempo ASC
    LIMIT 10
  `;

        const [tiempos] = await pool.query(sql, [id]);
        return tiempos;
    },

        async getUltimoTiempoMapa(id) {
        const sql = `
    SELECT 
      MIN(tiempo_id) AS tiempo_id,
      usuario_id,
      tiempo,
      fecha_inicio,
      fecha_fin
    FROM tiempo_mapa
    WHERE usuario_id = ?
    GROUP BY tiempo
    ORDER BY tiempo ASC
    LIMIT 1
  `;

        const [tiempos] = await pool.query(sql, [id]);
        return tiempos;
    }
}
module.exports = Logro;

