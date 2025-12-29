const Logro = require("../models/Logro");
const Departamento = require("../models/Departamento");
const LogroParaje = require("../models/LogroParaje");

// ===================================================
// GUARDAR TIEMPO DEL MAPA
// ===================================================
async function guardarTiempo(req, res) {
  try {
    const usuario_id = req.user?.sub;

    // 🛑 INVITADO (guest_xxx o undefined)
    if (!usuario_id || isNaN(Number(usuario_id))) {
      return res.json({
        ok: true,
        guest: true,
        msg: "Tiempo guardado solo en localStorage"
      });
    }

    const { fecha_inicio, fecha_fin, tiempo } = req.body;

    await Logro.insertTiempoMapa({
      usuario_id,
      fecha_inicio,
      fecha_fin,
      tiempo
    });

    res.json({ ok: true, mensaje: "Tiempo registrado" });

  } catch (err) {
    console.error("Error guardando tiempo:", err);
    res.status(500).json({ ok: false, error: "Error al guardar tiempo" });
  }
}

// ===================================================
// OBTENER LOGROS (PANTALLA LOGROS)
// ===================================================
async function obtenerLogros(req, res) {
  try {
    const usuarioId = req.user?.sub;

    // 🛑 INVITADO → vista vacía (usa localStorage)
    if (!usuarioId || isNaN(Number(usuarioId))) {
      return res.render("usuario/logros", {
        tiempos: [],
        parajes: [],
        departamentos: [],
        actual: null,
        insigniaCompletada: false
      });
    }

    const departamentoId = req.params.departamentoId;
    let insigniaCompletada = false;

    // ===================== DEPARTAMENTOS CON LOGROS =====================
    const departamentos =
      await Departamento.getDepartamentosConParajes(usuarioId);

    if (!departamentos || departamentos.length === 0) {
      return res.render("usuario/logros", {
        tiempos: [],
        parajes: [],
        departamentos: [],
        actual: null,
        insigniaCompletada: false
      });
    }

    // ===================== DEPARTAMENTO ACTUAL =====================
    let actual = departamentoId
      ? departamentos.find(d => d.departamento_id == departamentoId)
      : departamentos[0];

    if (!actual) actual = departamentos[0];

    // ===================== PARAJES DEL DEPTO =====================
    const parajes =
      await Departamento.getParajesByDepto(actual.departamento_id);

    // ===================== PARAJES COMPLETADOS =====================
    const completadosIds =
      await LogroParaje.getParajesCompletadosPorUsuarioYDepto(
        usuarioId,
        actual.departamento_id
      );

    const completadosSet = new Set(completadosIds);

    const parajeNoCompletado = parajes.find(
      p => !completadosSet.has(p.id)
    );

    if (!parajeNoCompletado && parajes.length > 0) {
      insigniaCompletada = true;
    }

    // ===================== TIEMPOS =====================
    const tiempos = await Logro.getTiemposMapa(usuarioId);
    const tiemposFormateados = tiempos.map(t => ({
      ...t,
      tiempoFormateado: formatearTiempo(t.tiempo)
    }));

    // ===================== PARAJES PARA MOSTRAR =====================
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
    console.error("Error obteniendo logros:", error);
    res.status(500).json({ ok: false, error: "Error al obtener logros" });
  }
}

// ===================================================
// OBTENER ÚLTIMOS LOGROS (PERFIL)
// ===================================================
async function obtenerUltimosLogros(req, res) {
  try {
    const usuarioId = req.user?.sub;

    // 🛑 INVITADO
    if (!usuarioId || isNaN(Number(usuarioId))) {
      return res.json({
        ok: true,
        tiempo: null,
        parajesCompletados: []
      });
    }

    const tiempo = await Logro.getUltimoTiempoMapa(usuarioId);
    const tiemposFormateados = tiempo.map(t => ({
      ...t,
      tiempoFormateado: formatearTiempo(t.tiempo)
    }));

    const parajesCompletados =
      await LogroParaje.getParajesCompletadosUltimosTres(usuarioId);

    res.json({
      ok: true,
      tiempo: tiemposFormateados[0] || null,
      parajesCompletados
    });

  } catch (err) {
    console.error("Error obteniendo últimos logros:", err);
    res.status(500).json({ ok: false, msg: "Error al obtener logros del perfil" });
  }
}

// ===================================================
// EXPORTS
// ===================================================
module.exports = {
  guardarTiempo,
  obtenerLogros,
  obtenerUltimosLogros
};

// ===================================================
// UTIL
// ===================================================
function formatearTiempo(segundos) {
  const minutos = Math.floor(segundos / 60);
  const segs = segundos % 60;

  return `${minutos < 10 ? "0" : ""}${minutos}:${segs < 10 ? "0" : ""}${segs}`;
}