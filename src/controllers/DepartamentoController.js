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
    // ==========================
    // USUARIO (normalizado)
    // ==========================
    const usuarioId =
      req.user && !isNaN(Number(req.user.usuario_id))
        ? Number(req.user.usuario_id)
        : null;

    // ==========================
    // DEPARTAMENTO
    // ==========================
    const departamentoDB = await Departamento.getById(id);
    if (!departamentoDB) {
      return res.status(404).render("notFound");
    }

    const departamento = colorizeDepto(departamentoDB);

    // ==========================
    // PARAJES DEL DEPARTAMENTO
    // ==========================
    const parajes = await Departamento.getParajesByDepto(id);
    if (!parajes || parajes.length === 0) {
      return res.status(404).render("notFound");
    }

    let paraje = null;
    let indexParaje = 1;

    // ==========================
    // USUARIO LOGUEADO → PROGRESO DB
    // ==========================
    if (usuarioId) {
      const completadosIds =
        await LogroParaje.getParajesCompletadosPorUsuarioYDepto(
          usuarioId,
          id
        );

      const completadosSet = new Set(completadosIds);

      // primer paraje NO completado
      paraje = parajes.find(p => !completadosSet.has(p.id));

      // si no hay → departamento completado
      if (!paraje) {
        return res.render("departamentoCompletado", {
          departamento,
          totalParajes: parajes.length,
        });
      }

      indexParaje = parajes.findIndex(p => p.id === paraje.id) + 1;
    }
    // ==========================
    // INVITADO
    // ==========================
    else {
      if (parajeQuery) {
        paraje = parajes.find(
          p => String(p.id) === String(parajeQuery)
        );
      }

      if (!paraje) {
        paraje = parajes[0];
      }

      indexParaje = parajes.findIndex(p => p.id === paraje.id) + 1;
    }

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
    const silabasMezcladas = shuffle([...silabasReales]);

    // ==========================
    // CONTADORES Y NAVEGACIÓN
    // ==========================
    const numeroParaje = indexParaje;
    const totalParajes = parajes.length;

    const idxActual = parajes.findIndex(p => p.id === paraje.id);
    const siguiente = parajes[idxActual + 1];

    const urlSiguiente = siguiente
      ? `/departamento/${id}?paraje=${siguiente.id}`
      : `/departamento/${id}/completado`;

    const urlVolver = `/departamentos`;

    // ==========================
    // DATA PARA FRONTEND
    // ==========================
    const juegoData = {
      usuarioId,
      parajeId: paraje.id,
      departamentoId: departamento.id,
      parajesDepartamento: parajes,
      nombreParaje: paraje.nombre,
      ordenCorrecto,
    };

    // ==========================
    // RENDER
    // ==========================
    res.render("departamento", {
      departamento,
      paraje,
      parajes,
      ordenCorrecto,
      silabas: silabasMezcladas,
      tokens,
      numeroParaje,
      totalParajes,
      urlSiguiente,
      urlVolver,
      juegoData,
    });
  } catch (err) {
    console.error("Error en verDepartamentoJuego:", err);
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
