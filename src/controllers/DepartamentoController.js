const Departamento = require("../models/Departamento");
const LogroParaje = require("../models/LogroParaje");

function colorizeDepto(departamento) {
  const cartaFile = (departamento.imagen_carta || "default.png").trim();
  const fondoFile = (departamento.imagen_fondo || "fondo-ULP-games.png").trim();

  return {
    ...departamento,
    colorFondo: departamento.color_fondo || "#4EC9F5",
    colorBorde: departamento.color_borde || "#007bb8",

    imagen_carta: cartaFile,
    imagen_fondo: fondoFile,
    imagen_carta_url: `/tarjetas/${cartaFile}`,
    imagen_fondo_url: `/fondos/${fondoFile}`,
  };
}

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

async function listarDepartamentos(req, res) {
  try {
    const departamentos = await Departamento.getAll();
    res.render("departamentos", { departamentos });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener los departamentos");
  }
}

async function verDepartamentoJuego(req, res) {
  const { paraje: parajeQuery } = req.query;
  const { id } = req.params;

  try {
    const usuarioId =
      req.user && !isNaN(Number(req.user.usuario_id))
        ? Number(req.user.usuario_id)
        : null;

    const departamentoDB = await Departamento.getById(id);
    if (!departamentoDB) return res.status(404).render("notFound");

    const departamento = colorizeDepto(departamentoDB);

    const parajes = await Departamento.getParajesByDepto(id);

    if (!parajes || parajes.length === 0) return res.status(404).render("notFound");

    let paraje = null;
    let indexParaje = 1;

    if (usuarioId) {
      const completadosIds = await LogroParaje.getParajesCompletadosPorUsuarioYDepto(
        usuarioId,
        id
      );

      const completadosSet = new Set((completadosIds || []).map((x) => String(x)));
      paraje = parajes.find((p) => !completadosSet.has(String(p.id)));

      if (!paraje) {
        const logros = await LogroParaje.getLogrosPorUsuarioYDepto(usuarioId, id);

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
              tiempoFormateado: formatTiempo(tiempoSeg),
            };
          })
          .sort((a, b) => {
            const ai = parajes.findIndex((p) => String(p.id) === a.parajeId);
            const bi = parajes.findIndex((p) => String(p.id) === b.parajeId);
            return ai - bi;
          });

        const totalSeg = tiempos.reduce((acc, t) => acc + (t.tiempoSeg || 0), 0);
        const tiempoTotalFormateado = formatTiempo(totalSeg);

        return res.render("departamentoCompletado", {
          departamento,
          totalParajes: parajes.length,
          tiempos,
          tiempoTotalFormateado,
        });
      }

      indexParaje = parajes.findIndex((p) => p.id === paraje.id) + 1;
    } else {
      // Invitados siempre juegan el primer paraje disponible o el indicado por query.
      if (parajeQuery) {
        paraje = parajes.find((p) => String(p.id) === String(parajeQuery));
      }
      if (!paraje) paraje = parajes[0];

      indexParaje = parajes.findIndex((p) => p.id === paraje.id) + 1;
    }

    // Se separan las silabas reales del layout visual para conservar los cortes de palabra.
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
      departamentoId: id,
      parajesDepartamento: parajes,
      nombreParaje: paraje.nombre,
      ordenCorrecto,
    };

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

function mostrarMapa(req, res) {
  try {
    res.render("mapa");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al renderizar mapa");
  }
}

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
  mostrarMapa,
  reiniciarDepartamento,
};
