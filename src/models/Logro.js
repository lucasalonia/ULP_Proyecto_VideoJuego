const pool = require("../config/db");

const Logro = {
    async insertTiempoMapa(tiempo_mapa) {
        const { fecha_inicio,fecha_fin,tiempo } = tiempo_mapa;
          const [tiempo_resultado] = await pool.query(
              "INSERT INTO`tiempo_mapa`(`usuario_id`, `fecha_inicio`, `fecha_fin`, `tiempo`) VALUES (1,?,?,?)",
              [ fecha_inicio, fecha_fin, tiempo])
           if (tiempo_resultado.affectedRows !== 1) {
            console.error("Error al insertar Tiempo mapa.");
            return false;
        }
        
    },



};
module.exports = Logro;

