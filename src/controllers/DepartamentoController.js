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
exports.listarDepartamentos = async (req, res) => {
  try {
    const departamentos = await Departamento.getAll();
    res.render("departamentos", { departamentos });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener los departamentos");
  }
};

// 🎮 VISTA DEL JUEGO DEPARTAMENTO
exports.verDepartamentoJuego = async (req, res) => {
  const { id } = req.params;
  try {
    const departamento = await Departamento.getById(id);
    if (!departamento) return res.status(404).render("notFound");

    const parajes = await Departamento.getParajesByDepto(id);
    if (!parajes?.length) return res.status(404).render("notFound");

    const dep = colorizeDepto(departamento);
    const paraje = parajes[Math.floor(Math.random() * parajes.length)];

    // === Procesar sílabas ===
    const rawParts = (paraje.silabas || "").split(/(-|\|)/);
    const tokens = [];
    for (const p of rawParts) {
      if (p === "-") continue;
      if (p === "|") tokens.push("|");
      else if (p.trim()) tokens.push(p);
    }

    const silabasReales = tokens.filter(t => t !== "|");
    const silabasMezcladas = shuffle(silabasReales);
    const ordenCorrecto = tokens.filter(t => t !== "|");

    res.render("departamento", {
      departamento: dep,
      paraje,
      tokens,
      silabas: silabasMezcladas,
      ordenCorrecto,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener el departamento");
  }
};

// 📄 VISTA DETALLE DEPARTAMENTO
exports.verDepartamentoDetalle = async (req, res) => {
  const { id } = req.params;
  try {
    const departamento = await Departamento.getById(id);
    if (!departamento) return res.status(404).render("notFound");

    const parajes = await Departamento.getParajesByDepto(id);
    res.render("departamentoDetalle", { departamento, parajes });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener los datos del departamento");
  }
};
