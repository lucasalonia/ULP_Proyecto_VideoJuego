const Logro = require("../models/Logro");
const Departamento = require("../models/Departamento");
const LogroParaje = require("../models/LogroParaje");

// ===================================================
// GUARDAR TIEMPO DEL MAPA
// ===================================================
async function guardarTiempo(req, res) {
  try {
    console.log("REQ.USER EN guardarTiempo:", req.user);

    const usuario_id = req.user?.usuario_id;

    // 🔒 Seguridad extra (nunca insertar sin usuario)
    if (!usuario_id || isNaN(Number(usuario_id))) {
      console.error("Usuario inválido en guardarTiempo:", req.user);
      return res.status(401).json({
        ok: false,
        error: "Usuario no autenticado",
      });
    }

    const { fecha_inicio, fecha_fin, tiempo } = req.body;

    // 🔒 Validación básica de datos
    if (!fecha_inicio || !fecha_fin || tiempo == null) {
      return res.status(400).json({
        ok: false,
        error: "Datos incompletos para guardar el tiempo",
      });
    }

    // ✅ Llamada correcta al modelo (PARÁMETROS SUELTOS)
    await Logro.insertTiempoMapa(
      usuario_id,
      fecha_inicio,
      fecha_fin,
      tiempo
    );

    return res.json({
      ok: true,
      mensaje: "Tiempo registrado",
    });
  } catch (err) {
    console.error("Error guardando tiempo:", err);
    return res.status(500).json({
      ok: false,
      error: "Error al guardar tiempo",
    });
  }
}

// ===================================================
// OBTENER LOGROS (PANTALLA LOGROS)
// ===================================================
async function obtenerLogros(req, res) {
  try {
    const usuarioId = req.user?.usuario_id;

    // 🛑 INVITADO → vista vacía
    if (!usuarioId || isNaN(Number(usuarioId))) {
      return res.render("usuario/logros", {
        tiempos: [],
        parajes: [],
        departamentos: [],
        actual: null,
        insigniaCompletada: false,
      });
    }

    const departamentoId = req.params.departamentoId;
    let insigniaCompletada = false;

    // ===================== DEPARTAMENTOS =====================
    const departamentos =
      await Departamento.getDepartamentosConParajes(usuarioId);

    if (!departamentos || departamentos.length === 0) {
      return res.render("usuario/logros", {
        tiempos: [],
        parajes: [],
        departamentos: [],
        actual: null,
        insigniaCompletada: false,
      });
    }

    // ===================== DEPTO ACTUAL =====================
    let actual = departamentoId
      ? departamentos.find((d) => d.departamento_id == departamentoId)
      : departamentos[0];

    if (!actual) actual = departamentos[0];

    // ===================== PARAJES =====================
    const parajes =
      await Departamento.getParajesByDepto(actual.departamento_id);

    const completadosIds =
      await LogroParaje.getParajesCompletadosPorUsuarioYDepto(
        usuarioId,
        actual.departamento_id
      );

    const completadosSet = new Set(completadosIds);

    const parajeNoCompletado = parajes.find(
      (p) => !completadosSet.has(p.id)
    );

    if (!parajeNoCompletado && parajes.length > 0) {
      insigniaCompletada = true;
    }

    // ===================== TIEMPOS =====================
    const tiempos = await Logro.getTiemposMapa(usuarioId);
    const tiemposFormateados = tiempos.map((t) => ({
      ...t,
      tiempoFormateado: formatearTiempo(t.tiempo),
    }));

    // ===================== PARAJES COMPLETADOS =====================
    const parajesCompletados =
      await LogroParaje.getParajesCompletadosPorUsuarioYDeptoNombre(
        usuarioId,
        actual.departamento_id
      );

    // ===================== RENDER =====================
    return res.render("usuario/logros", {
      tiempos: tiemposFormateados,
      parajes: parajesCompletados,
      departamentos,
      actual,
      insigniaCompletada,
    });
  } catch (error) {
    console.error("Error obteniendo logros:", error);
    return res.status(500).json({
      ok: false,
      error: "Error al obtener logros",
    });
  }
}

// ===================================================
// OBTENER ÚLTIMOS LOGROS (PERFIL)
// ===================================================
async function obtenerUltimosLogros(req, res) {
  try {
    const usuarioId = req.user?.usuario_id;

    // 🛑 INVITADO
    if (!usuarioId || isNaN(Number(usuarioId))) {
      return res.json({
        ok: true,
        tiempo: null,
        parajesCompletados: [],
      });
    }

    const tiempo = await Logro.getUltimoTiempoMapa(usuarioId);
    const tiemposFormateados = tiempo.map((t) => ({
      ...t,
      tiempoFormateado: formatearTiempo(t.tiempo),
    }));

    const parajesCompletados =
      await LogroParaje.getParajesCompletadosUltimosTres(usuarioId);

    return res.json({
      ok: true,
      tiempo: tiemposFormateados[0] || null,
      parajesCompletados,
    });
  } catch (err) {
    console.error("Error obteniendo últimos logros:", err);
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener logros del perfil",
    });
  }
}

// ===================================================
// Paraje Por Departamento Patalla Mapa.
// ===================================================
async function obtenerProgresoDepartamento(req, res) {
  try {
    const usuarioId = req.user?.usuario_id;
    const deptoId = req.params.deptoId;

    // 🛑 INVITADO
    if (!usuarioId || isNaN(Number(usuarioId))) {
      return res.json({
        ok: true,
        invitado: true,
        totalParajes: 0,
        parajesRealizados: 0,
        porcentaje: 0,
      });
    }

    const parajesCompletados =
      await LogroParaje.getParajesCompletadosPorUsuarioYDepto(
        usuarioId,
        deptoId
      );

    const totalParajes =
      await Departamento.getParajesByDepto(deptoId).then((parajes) => parajes.length);

    const cantidadCompletados = parajesCompletados.length;

    const porcentaje =
      totalParajes > 0
        ? Math.round((cantidadCompletados / totalParajes) * 100)
        : 0;

    return res.json({
      ok: true,
      totalParajes,
      parajesRealizados: cantidadCompletados,
      porcentaje,
      listaParajes: parajesCompletados,
    });

  } catch (err) {
    console.error("Error obteniendo progreso del departamento:", err);
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener progreso del departamento",
    });
  }
}


// ===================================================
// EXPORTS
// ===================================================
module.exports = {
  guardarTiempo,
  obtenerLogros,
  obtenerUltimosLogros,
  obtenerProgresoDepartamento,
};

// ===================================================
// UTIL
// ===================================================
function formatearTiempo(segundos) {
  const minutos = Math.floor(segundos / 60);
  const segs = segundos % 60;

  return `${minutos < 10 ? "0" : ""}${minutos}:${
    segs < 10 ? "0" : ""
  }${segs}`;
}
