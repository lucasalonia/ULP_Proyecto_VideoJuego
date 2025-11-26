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

  // ⭐⭐⭐ NUEVO MÉTODO QUE FALTABA ⭐⭐⭐
  async countAll() {
    const [[row]] = await pool.query(
      "SELECT COUNT(*) AS total FROM departamento"
    );
    return row.total;
  }
};

module.exports = Departamento;
