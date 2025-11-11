const Logro =require("../models/Logro")


module.exports = {

    async guardarTiempo(req, res) {
  try {
    const { id_jugador, fecha_inicio, fecha_fin, tiempo } = req.body;
    await Logro.insertTiempoMapa({ id_jugador, fecha_inicio, fecha_fin, tiempo });
    res.json({ ok: true, mensaje: "Tiempo registrado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Error al guardar tiempo" });
  }
}
}
