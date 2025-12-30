const Departamento = require("../models/Departamento");
const LogroParaje = require("../models/LogroParaje");



// Añade colores e imágenes por defecto al departamento
function colorizeDepto(departamento) {
  return {
    ...departamento,
    colorFondo: departamento.color_fondo || "#4EC9F5",
    colorBorde: departamento.color_borde || "#007bb8",
    imagen_carta: departamento.imagen_carta || "default.png",
    imagen_fondo: departamento.imagen_fondo || "fondoJuego.png",
  };
}

// Mezcla aleatoriamente las sílabas
function shuffle(arr) {
  return arr
    .map(v => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map(o => o.v);
}

// LISTAR DEPARTAMENTOS
async function listarDepartamentos(req, res) {
  try {
    const departamentos = await Departamento.getAll();
    res.render("departamentos", { departamentos });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener los departamentos");
  }
}

// JUEGO POR PARAJE — LÓGICA CORRECTA
async function verDepartamentoJuego(req, res) {
  const { paraje: parajeQuery } = req.query;

  const { id } = req.params; // id del departamento

  try {
    // 👉 USUARIO REAL (JWT) O NULL SI INVITADO
    const usuarioId =
      req.user && !isNaN(Number(req.user.sub))
        ? Number(req.user.sub)
        : null;

    const departamento = await Departamento.getById(id);
    if (!departamento) return res.status(404).render("notFound");

    // TODOS los parajes del depto
    const parajes = await Departamento.getParajesByDepto(id);
    if (!parajes?.length) return res.status(404).render("notFound");

    let paraje = null;
    let indexParaje = 1;

    // 🔐 USUARIO LOGUEADO → progreso real desde DB
    if (usuarioId) {
      const completadosIds =
        await LogroParaje.getParajesCompletadosPorUsuarioYDepto(
          usuarioId,
          id
        );

      const completadosSet = new Set(completadosIds);

      // Elegir el PRIMER paraje no completado
      paraje = parajes.find(p => !completadosSet.has(p.id));

      // Si no hay → departamento COMPLETADO
      if (!paraje) {
        const dep = colorizeDepto(departamento);
        return res.render("departamentoCompletado", {
          departamento: dep,
          totalParajes: parajes.length,
        });
      }

      indexParaje = parajes.findIndex(p => p.id === paraje.id) + 1;
    }
    // 👤 INVITADO → SIEMPRE renderiza el primero
    // 👉 el avance real se maneja en el front con LocalStorage
    else {
      // 👉 si el front pide un paraje específico
      if (parajeQuery) {
        paraje = parajes.find(
          p => String(p.id) === String(parajeQuery)
        );
      }

      // fallback de seguridad
      if (!paraje) {
        paraje = parajes[0];
      }

      indexParaje = parajes.findIndex(p => p.id === paraje.id) + 1;
    }


    const dep = colorizeDepto(departamento);

    // ==========================
    // PROCESAR SÍLABAS
    // ==========================
    const palabras = (paraje.silabas || "").split("|");

    const silabasReales = [];
    const tokens = [];

    palabras.forEach((palabra, index) => {
      const silabasPalabra = palabra
        .split("-")
        .map(s => s.trim())
        .filter(Boolean);

      silabasReales.push(...silabasPalabra);
      tokens.push(...silabasPalabra);

      if (index < palabras.length - 1) {
        tokens.push("|");
      }
    });

    const ordenCorrecto = silabasReales;
    const silabasMezcladas = shuffle(silabasReales);

    // ==========================
    // RENDER
    // ==========================
    res.render("departamento", {
      departamento: dep,
      departamentoId: departamento.departamento_id,
      paraje,
      usuarioId,
      tokens,
      silabas: silabasMezcladas,
      ordenCorrecto,
      numeroParaje: indexParaje,
      totalParajes: parajes.length,
      urlSiguiente: `/departamento/${id}`, // solo fallback
      urlVolver: "/mapa",

      // 🔑 CLAVE PARA LOCAL STORAGE
      parajes, // 👈 ESTO FALTABA
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener el departamento");
  }
}


// DETALLE
async function verDepartamentoDetalle(req, res) {
  try {
    const departamento = await Departamento.getById(req.params.id);
    const parajes = await Departamento.getParajesByDepto(req.params.id);
    res.render("departamentoDetalle", { departamento, parajes });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener los datos del departamento");
  }
}

// 🗺 MAPA
function mostrarMapa(req, res) {
  try {
    res.render("mapa");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al renderizar mapa");
  }
}

module.exports = {
  listarDepartamentos,
  verDepartamentoJuego,
  verDepartamentoDetalle,
  mostrarMapa,
};
