const pool = require("../config/db");

const Departamento = {
  async getAll() {
    const [departamentos] = await pool.query("SELECT * FROM departamento");
    return departamentos;
  },

  async getById(id) {
    const [[departamento]] = await pool.query(
      "SELECT * FROM departamento WHERE departamento_id = ?",
      [id]
    );
    return departamento;
  },

  async getParajesByDepto(id) {
    const [parajes] = await pool.query(
      "SELECT * FROM paraje WHERE departamento_id = ?",
      [id]
    );
    return parajes;
  },

  ///////
  async countAll() {
    const [[row]] = await pool.query(
      "SELECT COUNT(*) AS total FROM departamento"
    );
    return row.total;
  },

  async getDepartamentosConParajes(usuarioId) {
    const [rows] = await pool.query(
      `SELECT 
        d.departamento_id,
        d.nombre,
        COUNT(l.logro_id) AS cantidad_logros
     FROM departamento d
     INNER JOIN paraje p 
        ON p.departamento_id = d.departamento_id
     INNER JOIN logro l 
        ON l.paraje_id = p.id
     WHERE l.usuario_id = ?
     GROUP BY d.departamento_id, d.nombre
     ORDER BY d.departamento_id;`,
      [usuarioId]
    );
    return rows;
  }

};

module.exports = Departamento;
