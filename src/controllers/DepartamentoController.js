const pool = require("../config/db");

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
    const [departamentos] = await pool.query("SELECT * FROM departamento");
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
    const [[departamento]] = await pool.query(
      "SELECT * FROM departamento WHERE departamento_id = ?",
      [id]
    );
    if (!departamento) return res.status(404).render("notFound");

    const [parajes] = await pool.query(
      "SELECT * FROM paraje WHERE departamento_id = ?",
      [id]
    );
    if (!parajes?.length) return res.status(404).render("notFound");

    const dep = colorizeDepto(departamento);

    // Paraje aleatorio
    const paraje = parajes[Math.floor(Math.random() * parajes.length)];

    // === Procesar sílabas ===
    const rawParts = (paraje.silabas || "").split(/(-|\|)/);
    const tokens = [];
    for (const p of rawParts) {
      if (p === "-") continue;
      if (p === "|") tokens.push("|"); // marcador visual de hueco
      else if (p.trim()) tokens.push(p);
    }

    // Solo las sílabas reales participan del juego
    const silabasReales = tokens.filter(t => t !== "|");
    const silabasMezcladas = shuffle(silabasReales);

    // ordenCorrecto sin los huecos, para validación
    const ordenCorrecto = tokens.filter(t => t !== "|");

    res.render("departamento", {
      departamento: dep,
      paraje,
      tokens,               // incluye huecos visuales
      silabas: silabasMezcladas, // chips mezclados
      ordenCorrecto,        // para validar el orden correcto
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
    const [[departamento]] = await pool.query(
      "SELECT * FROM departamento WHERE departamento_id = ?",
      [id]
    );
    if (!departamento) return res.status(404).render("notFound");

    const [parajes] = await pool.query(
      "SELECT * FROM paraje WHERE departamento_id = ?",
      [id]
    );

    res.render("departamentoDetalle", { departamento, parajes });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener los datos del departamento");
  }
};
