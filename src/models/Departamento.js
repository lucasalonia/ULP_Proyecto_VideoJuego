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
  }
};

module.exports = Departamento;
