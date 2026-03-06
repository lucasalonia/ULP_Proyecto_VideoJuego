const Departamento = require("../models/Departamento");
const LogroParaje = require("../models/LogroParaje");

// Añade colores e imágenes por defecto al departamento
function colorizeDepto(departamento) {
  const cartaFile = (departamento.imagen_carta || "default.png").trim();
  const fondoFile = (departamento.imagen_fondo || "fondo-ULP-games.png").trim();

  return {
    ...departamento,
    colorFondo: departamento.color_fondo || "#4EC9F5",
    colorBorde: departamento.color_borde || "#007bb8",

    // lo que ya tenías (NOMBRES)
    imagen_carta: cartaFile,
    imagen_fondo: fondoFile,

    // NUEVO: URLs listas para usar
    imagen_carta_url: `/tarjetas/${cartaFile}`,
    imagen_fondo_url: `/fondos/${fondoFile}`,
  };
}

// Mezcla aleatoriamente las sílabas
function shuffle(arr) {
  return arr
    .map((v) => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map((o) => o.v);
}

function formatTiempo(seg) {
  const s = Math.max(0, Number(seg) || 0);
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
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

// JUEGO POR PARAJE
// JUEGO POR PARAJE
async function verDepartamentoJuego(req, res) {
  const { paraje: parajeQuery } = req.query;
  const { id } = req.params;

  try {
    const usuarioId =
      req.user && !isNaN(Number(req.user.usuario_id))
        ? Number(req.user.usuario_id)
        : null;

    console.log("=== verDepartamentoJuego ===");
    console.log("depto id param:", id);
    console.log("query paraje:", parajeQuery);
    console.log("usuarioId:", usuarioId);
    console.log("req.user:", req.user);

    const departamentoDB = await Departamento.getById(id);
    if (!departamentoDB) return res.status(404).render("notFound");

    const departamento = colorizeDepto(departamentoDB);

    const parajes = await Departamento.getParajesByDepto(id);
    console.log("parajes length:", parajes ? parajes.length : 0);

    if (!parajes || parajes.length === 0) return res.status(404).render("notFound");

    let paraje = null;
    let indexParaje = 1;

    // ==========================
    // LOGUEADO → progreso DB
    // ==========================
    if (usuarioId) {
      const completadosIds = await LogroParaje.getParajesCompletadosPorUsuarioYDepto(
        usuarioId,
        id
      );

      console.log("completadosIds:", completadosIds);

      const completadosSet = new Set((completadosIds || []).map((x) => String(x)));

      // primer paraje NO completado
      paraje = parajes.find((p) => !completadosSet.has(String(p.id)));

      console.log("primer NO completado:", paraje ? { id: paraje.id, nombre: paraje.nombre } : null);

      // si no hay → departamento completado
      if (!paraje) {
        const logros = await LogroParaje.getLogrosPorUsuarioYDepto(usuarioId, id);

        console.log("logros length:", logros ? logros.length : 0);
        console.log("logros[0]:", logros && logros[0]);

        const parajeById = new Map(parajes.map((p) => [String(p.id), p]));

        const tiempos = (logros || [])
          .map((l) => {
            const pid = String(l.paraje_id);
            const tiempoSeg = Number(l.tiempo || 0);
            const p = parajeById.get(pid);

            return {
              parajeId: pid,
              parajeNombre: p ? p.nombre : `Paraje ${pid}`,
              tiempoSeg,
              tiempoFormateado: formatTiempo(tiempoSeg), // ✅ lo que necesita el Pug
            };
          })
          .sort((a, b) => {
            const ai = parajes.findIndex((p) => String(p.id) === a.parajeId);
            const bi = parajes.findIndex((p) => String(p.id) === b.parajeId);
            return ai - bi;
          });

        const totalSeg = tiempos.reduce((acc, t) => acc + (t.tiempoSeg || 0), 0);
        const tiempoTotalFormateado = formatTiempo(totalSeg);

        console.log("tiempos length:", tiempos.length);
        console.log("tiempos[0]:", tiempos[0]);
        console.log("totalSeg:", totalSeg, "tiempoTotalFormateado:", tiempoTotalFormateado);

        return res.render("departamentoCompletado", {
          departamento,
          totalParajes: parajes.length,
          tiempos,
          tiempoTotalFormateado,
        });
      }

      indexParaje = parajes.findIndex((p) => p.id === paraje.id) + 1;
    } else {
      // ==========================
      // INVITADO
      // ==========================
      if (parajeQuery) {
        paraje = parajes.find((p) => String(p.id) === String(parajeQuery));
      }
      if (!paraje) paraje = parajes[0];

      indexParaje = parajes.findIndex((p) => p.id === paraje.id) + 1;
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
        .map((s) => s.trim())
        .filter(Boolean);

      silabasReales.push(...silabasPalabra);
      tokens.push(...silabasPalabra);

      if (index < palabras.length - 1) tokens.push("|");
    });

    const ordenCorrecto = silabasReales;
    const silabasMezcladas = shuffle([...silabasReales]);

    const numeroParaje = indexParaje;
    const totalParajes = parajes.length;

    const idxActual = parajes.findIndex((p) => p.id === paraje.id);
    const siguiente = parajes[idxActual + 1];

    const urlSiguiente = siguiente
      ? `/departamento/${id}?paraje=${siguiente.id}`
      : `/departamento/${id}`;

    const urlVolver = `/departamentos`;

    const juegoData = {
      usuarioId,
      parajeId: paraje.id,
      departamentoId: departamento.id,
      parajesDepartamento: parajes,
      nombreParaje: paraje.nombre,
      ordenCorrecto,
    };

    console.log("render departamento juego:", {
      departamentoId: departamento.id,
      parajeId: paraje.id,
      numeroParaje,
      totalParajes,
    });

    return res.render("departamento", {
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
    return res.status(500).send("Error al obtener el departamento");
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

// MAPA
function mostrarMapa(req, res) {
  try {
    res.render("mapa");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al renderizar mapa");
  }
}

// REINICIAR (borra logros del depto)
async function reiniciarDepartamento(req, res) {
  const { id } = req.params;

  const usuarioId =
    req.user && !isNaN(Number(req.user.usuario_id))
      ? Number(req.user.usuario_id)
      : null;

  if (!usuarioId) return res.redirect(`/departamento/${id}`);

  try {
    await LogroParaje.borrarPorUsuarioYDepto(usuarioId, id);
    return res.redirect(`/departamento/${id}`);
  } catch (err) {
    console.error("Error reiniciando departamento:", err);
    return res.status(500).send("Error al reiniciar el departamento");
  }
}

module.exports = {
  listarDepartamentos,
  verDepartamentoJuego,
  verDepartamentoDetalle,
  mostrarMapa,
  reiniciarDepartamento,
};
