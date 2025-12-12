const LogroParaje = require("../models/LogroParaje");

module.exports = {
  async guardarLogro(req, res) {
    try {
      const {  paraje_id, fecha_inicio, fecha_fin, tiempo } = req.body;
      const usuario_id = req.user.sub;
      const id = await LogroParaje.guardar({
        usuario_id,
        paraje_id,
        fecha_inicio,
        fecha_fin,
        tiempo
      });
      console.log("Logro guardado con ID:", usuario_id);
      res.json({ ok: true, logroId: id });
    } catch (err) {
      console.error("Error guardando logro:", err);
      res.status(500).json({ ok: false, error: "Error al guardar logro" });
    }
  }
};
