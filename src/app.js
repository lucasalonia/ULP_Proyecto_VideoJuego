const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require('cookie-parser');
require('dotenv').config();

const session = require("express-session");
// ===== SESIÓN (necesario para usuarioId) =====
app.use(
  session({
    secret: "comarcas-secret",
    resave: false,
    saveUninitialized: true,
  })
);


const PORT = process.env.PORT || 3309;

// Rutas
const indexRuta = require("./routes/indexRuta");
const departamentoRuta = require("./routes/departamentoRuta");
const loginRuta = require("./routes/loginRuta");
const logroRuta= require("./routes/logroRuta");
const usuarioRuta= require("./routes/usuarioRuta");

const logroParajeRuta = require("./routes/logroParajeRuta");
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const { verifyToken } = require('./middlewares/authMiddleware');
const { globalPugContext } = require('./middlewares/contextMiddleware');

// Servir archivos estáticos (CSS, JS, imágenes)

// Configuración del motor de vistas
const directorioVistas = path.join(__dirname, "views");
app.set("view engine", "pug");
app.set("views", directorioVistas);
console.log("Directorio de vistas:", directorioVistas);


/*Rutas publicas*/
//Login
app.use("/", loginRuta);


/*MIDDLEWARE con TOKEN*/
app.use(verifyToken);
app.use(globalPugContext);

// Rutas privadas
app.use("/", indexRuta);

app.use("/", departamentoRuta);

app.use("/", logroRuta);

app.use("/", usuarioRuta);

//Paraje
app.use("/", logroParajeRuta);

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
