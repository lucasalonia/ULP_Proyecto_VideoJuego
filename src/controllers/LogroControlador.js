const Logro = require("../models/Logro");
const Departamento = require("../models/Departamento");
const LogroParaje = require("../models/LogroParaje");

module.exports = {

  async guardarTiempo(req, res) {
    const id = req.user.sub;
    console.log("ID " + id);
    try {
      const { fecha_inicio, fecha_fin, tiempo } = req.body;
      await Logro.insertTiempoMapa({ id, fecha_inicio, fecha_fin, tiempo });
      res.json({ ok: true, mensaje: "Tiempo registrado" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ ok: false, error: "Error al guardar tiempo" });
    }
  },

  async obtenerLogros(req, res) {
    const usuarioId = req.user.sub;                 // ID del user desde el JWT
    const departamentoId = req.params.departamentoId; // Puede venir o no por URL
    console.log("Entro a logros", usuarioId);
    console.log("Entro a logros sin id");
    
    try {
      // 1) Obtener TODOS los departamentos donde el usuario completó parajes
      const departamentos = await Departamento.getDepartamentosConParajes(usuarioId);
console.log("Departamentos obtenidos:", departamentos.length);
      if (!departamentos || departamentos.length === 0) {
        return res.render("usuario/logros", { tiempos: [], parajes: [], departamentos: [], actual: null });
      }

      // 2) Determinar cuál mostrar
      let actual;

      if (departamentoId) {
        actual = departamentos.find(d => d.departamento_id == departamentoId);
      }

      // Si no vino ninguno por URL, usar el primero
      if (!actual) {
        actual = departamentos[0];
      }

      // 3) Obtener tiempos
      const tiempos = await Logro.getTiemposMapa(usuarioId);
console.log("Tiempos obtenidos:", tiempos);
      const tiemposFormateados = tiempos.map(t => ({
        ...t,
        tiempoFormateado: formatearTiempo(t.tiempo)
      }));
console.log("Tiempos formateados:", tiemposFormateados);
      // 4) Obtener los parajes COMPLETADOS del depto actual
      const parajesCompletados = await LogroParaje.getParajesCompletadosPorUsuarioYDeptoNombre(
        usuarioId,
        actual.departamento_id
      );

      // 5) Render
      res.render("usuario/logros", {
        tiempos: tiemposFormateados,
        parajes: parajesCompletados,
        departamentos,
        actual
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, error: "Error al obtener logros" });
    }
  },
  async obtenerUltimosLogros(req, res) {
    const usuarioId = req.user.sub;
    console.log("Entro a ultimos logros", usuarioId);
    try {
      const tiempo = await Logro.getUltimoTiempoMapa(usuarioId);
console.log(tiempo);
      const tiemposFormateados = tiempo.map(t => ({
        ...t,
        tiempoFormateado: formatearTiempo(t.tiempo)
      }));

      // 4) Obtener los parajes COMPLETADOS del depto actual
      const parajesCompletados = await LogroParaje.getParajesCompletadosUltimosTres(
        usuarioId,

      );
      console.log("tiempo",tiemposFormateados);
      res.json({
        ok: true,
        tiempo: tiemposFormateados[0] || null,
        parajesCompletados: parajesCompletados || []
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ ok: false, msg: "Error al obtener logros del perfil" });
    }
  }
}
// Función auxiliar para formatear segundos a MM:SS
function formatearTiempo(segundos) {
  const minutos = Math.floor(segundos / 60);
  const segs = segundos % 60;

  // Añadir cero inicial si es necesario
  const minutosStr = minutos < 10 ? `0${minutos}` : `${minutos}`;
  const segsStr = segs < 10 ? `0${segs}` : `${segs}`;

  return `${minutosStr}:${segsStr}`;
}

