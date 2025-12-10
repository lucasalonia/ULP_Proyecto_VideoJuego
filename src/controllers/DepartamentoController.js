const Departamento = require("../models/Departamento");
const LogroParaje = require("../models/LogroParaje");

// 🎨 Añade colores e imágenes por defecto al departamento
function colorizeDepto(departamento) {
  return {
    ...departamento,
    colorFondo: departamento.color_fondo || "#4EC9F5",
    colorBorde: departamento.color_borde || "#007bb8",
    imagen_carta: departamento.imagen_carta || "default.png",
    imagen_fondo: departamento.imagen_fondo || "fondoJuego.png",
  };
}

// 🔀 Mezcla aleatoriamente las sílabas
function shuffle(arr) {
  return arr
    .map(v => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map(o => o.v);
}

// 🧭 LISTAR DEPARTAMENTOS
async function listarDepartamentos(req, res) {
  try {
    const departamentos = await Departamento.getAll();
    res.render("departamentos", { departamentos });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener los departamentos");
  }
}

// 🎮 JUEGO POR PARAJE — FASE 3 COMPLETA
async function verDepartamentoJuego(req, res) {
  const { id } = req.params; // id del departamento

  try {
    // Usuario temporal (hasta login real)
    if (!req.session.usuarioId) {
      req.session.usuarioId = 1;
    }
    const usuarioId = req.session.usuarioId;

    const departamento = await Departamento.getById(id);
    if (!departamento) return res.status(404).render("notFound");

    // TODOS los parajes del depto
    const parajes = await Departamento.getParajesByDepto(id);
    if (!parajes?.length) return res.status(404).render("notFound");

    // IDs de parajes ya completados por este usuario en este departamento
    const completadosIds = await LogroParaje.getParajesCompletadosPorUsuarioYDepto(
      usuarioId,
      id
    );
    const completadosSet = new Set(completadosIds);

    // Elegir el PRIMER paraje no completado
    const paraje = parajes.find(p => !completadosSet.has(p.id));

    // Si no hay → ya completó el departamento
    if (!paraje) {
      const dep = colorizeDepto(departamento);
      return res.render("departamentoCompletado", {
        departamento: dep,
        totalParajes: parajes.length
      });
    }

    const dep = colorizeDepto(departamento);

    // Procesar sílabas
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

    // Preparar datos para la vista
    const ordenCorrecto = silabasReales;
    const silabasMezcladas = shuffle(silabasReales);

    const totalParajes = parajes.length;
    const indexParaje = parajes.findIndex(p => p.id === paraje.id) + 1;

    res.render("departamento", {
      departamento: dep,
      paraje,
      usuarioId,
      tokens,
      silabas: silabasMezcladas,
      ordenCorrecto,
      numeroParaje: indexParaje,
      totalParajes,
      urlSiguiente: `/departamento/${id}`, // vuelve a cargar y toma siguiente
      urlVolver: "/mapa",
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener el departamento");
  }
}

// 📄 DETALLE
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
