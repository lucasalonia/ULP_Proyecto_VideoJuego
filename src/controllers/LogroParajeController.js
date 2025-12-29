const LogroParaje = require("../models/LogroParaje");

module.exports = {
  async guardarLogro(req, res) {
    try {
      const usuario_id = req.user?.sub;

      // 🛑 INVITADO (guest_xxx o undefined)
      if (!usuario_id || isNaN(Number(usuario_id))) {
        return res.json({
          ok: true,
          guest: true,
          msg: "Logro guardado solo en localStorage"
        });
      }

      const { paraje_id, fecha_inicio, fecha_fin, tiempo } = req.body;

      const id = await LogroParaje.guardar({
        usuario_id,
        paraje_id,
        fecha_inicio: new Date(fecha_inicio),
        fecha_fin: new Date(fecha_fin),
        tiempo
      });

      res.json({ ok: true, logroId: id });

    } catch (err) {
      console.error("Error guardando logro:", err);
      res.status(500).json({ ok: false, error: "Error al guardar logro" });
    }
  }
};
