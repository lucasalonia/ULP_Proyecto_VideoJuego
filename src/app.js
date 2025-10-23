const express = require("express");
const app = express();
const path = require("path");
const pug = require("pug");
require('dotenv').config();
const PORT = process.env.PORT || 3309;

// Rutas
const indexRuta = require("./routes/indexRuta");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Configuración del motor de vistas
const directorioVistas = path.join(__dirname, "views");
app.set("view engine", "pug");
app.set("views", directorioVistas);
console.log("Directorio de vistas:", directorioVistas);

// Rutas principales
app.use("/", indexRuta);

// Página 404
app.use((req, res) => {
  res.status(404).render("notFound");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
