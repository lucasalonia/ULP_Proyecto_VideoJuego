const express = require("express");
const app = express();
const path = require("path");
require('dotenv').config();

const PORT = process.env.PORT || 3309;

// Rutas
const indexRuta = require("./routes/indexRuta");
const departamentoRuta = require("./routes/departamentoRuta");
const loginRuta = require("./routes/loginRuta");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, "public")));

// Configuración del motor de vistas
const directorioVistas = path.join(__dirname, "views");
app.set("view engine", "pug");
app.set("views", directorioVistas);
console.log("Directorio de vistas:", directorioVistas);

// Rutas principales
app.use("/", indexRuta);

// Departamento

app.use("/", departamentoRuta);
app.use("/", loginRuta);

//
const pool = require("./config/db");

(async () => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM departamento");
    console.log("✅ Conexión exitosa. Total de departamentos:", rows[0].total);
  } catch (err) {
    console.error("❌ Error al conectar a la base de datos:", err.message);
  }
})();
// Página 404
app.use((req, res) => {
  res.status(404).render("notFound");
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



module.exports = app;
