const Logro = require("../models/Logro");
const Departamento = require("../models/Departamento");
const LogroParaje = require("../models/LogroParaje");
const LogroParajeController = require("./LogroParajeController");

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
  const usuarioId = req.user.sub;
  const departamentoId = req.params.departamentoId;

  let insigniaCompletada = false;

  try {

    // ===================== OBTENER DEPARTAMENTOS CON PARAJES COMPLETADOS =====================
    const departamentos = await Departamento.getDepartamentosConParajes(usuarioId);

    if (!departamentos || departamentos.length === 0) {
      return res.render("usuario/logros", {
        tiempos: [],
        parajes: [],
        departamentos: [],
        actual: null,
        insigniaCompletada: false
      });
    }

    // ===================== DETERMINAR DEPARTAMENTO ACTUAL =====================
    let actual = null;

    if (departamentoId) {
      actual = departamentos.find(d => d.departamento_id == departamentoId);
    }

    // SI NO VIENE POR URL, USAR EL PRIMERO
    if (!actual) {
      actual = departamentos[0];
    }

    // ===================== OBTENER PARAJES DEL DEPARTAMENTO ACTUAL =====================
    const parajes = await Departamento.getParajesByDepto(actual.departamento_id);

    // ===================== OBTENER IDS DE PARAJES COMPLETADOS POR EL USUARIO =====================
    const completadosIds = await LogroParaje.getParajesCompletadosPorUsuarioYDepto(
      usuarioId,
      actual.departamento_id
    );

    const completadosSet = new Set(completadosIds);

    // ===================== BUSCAR SI HAY ALGUN PARAJE NO COMPLETADO =====================
    const parajeNoCompletado = parajes.find(p => !completadosSet.has(p.id));

    // ===================== SI NO HAY PARAJES PENDIENTES, EL DEPARTAMENTO ESTA COMPLETADO =====================
    if (!parajeNoCompletado && parajes.length > 0) {
      insigniaCompletada = true;
    }

    // ===================== OBTENER TIEMPOS =====================
    const tiempos = await Logro.getTiemposMapa(usuarioId);

    const tiemposFormateados = tiempos.map(t => ({
      ...t,
      tiempoFormateado: formatearTiempo(t.tiempo)
    }));

    // ===================== OBTENER PARAJES COMPLETADOS PARA MOSTRAR =====================
    const parajesCompletados =
      await LogroParaje.getParajesCompletadosPorUsuarioYDeptoNombre(
        usuarioId,
        actual.departamento_id
      );

    // ===================== RENDER =====================
    res.render("usuario/logros", {
      tiempos: tiemposFormateados,
      parajes: parajesCompletados,
      departamentos,
      actual,
      insigniaCompletada
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

