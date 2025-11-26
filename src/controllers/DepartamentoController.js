const Departamento = require("../models/Departamento");

// 🎨 Añade colores e imágenes por defecto al departamento
function colorizeDepto(departamento) {
  return {
    ...departamento,
    colorFondo: departamento.color_fondo || "#4EC9F5",
    colorBorde: departamento.color_borde || "#007bb8",
    imagen_carta: departamento.imagen_carta || "default.png",
    imagen_fondo: departamento.imagen_fondo || "default-bg.jpg",
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

// 🎮 JUEGO POR PARAJE
async function verDepartamentoJuego(req, res) {
  const { id } = req.params;

  try {
    const departamento = await Departamento.getById(id);
    if (!departamento) return res.status(404).render("notFound");

    const parajes = await Departamento.getParajesByDepto(id);
    if (!parajes?.length) return res.status(404).render("notFound");

    const dep = colorizeDepto(departamento);

    // Para obtener un paraje al azar
    const paraje = parajes[Math.floor(Math.random() * parajes.length)];

    // Separar sílabas: palabras con | y sílabas con -
    // === construir palabras y sílabas ===
    const palabras = (paraje.silabas || "").split("|"); // ej: ["La", "A-gua-da"]

    const silabasReales = []; // solo sílabas, para la lógica
    const tokens = [];        // sílabas + '|' para los casilleros

    palabras.forEach((palabra, index) => {
      const silabasPalabra = palabra
        .split("-")            // ["A","gua","da"]
        .map(s => s.trim())
        .filter(Boolean);

      // para la lógica
      silabasReales.push(...silabasPalabra);

      // para la vista (casilleros)
      tokens.push(...silabasPalabra);

      // entre palabra y palabra agregamos un marcador de espacio
      if (index < palabras.length - 1) {
        tokens.push("|");
      }
    });

    const ordenCorrecto = silabasReales;
    const silabasMezcladas = shuffle(silabasReales);

    console.log("TOKENS:", tokens);
    console.log("ORDEN CORRECTO:", ordenCorrecto);


    const totalParajes = parajes.length;
    const indexParaje = parajes.findIndex(p => p.id === paraje.id) + 1;

    res.render("departamento", {
      departamento: dep,
      paraje,
      tokens,
      silabas: silabasMezcladas,
      ordenCorrecto,
      numeroParaje: indexParaje,
      totalParajes,
      urlSiguiente: `/departamento/${id}`,
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
