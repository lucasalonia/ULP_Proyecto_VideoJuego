const express = require("express");
const router = express.Router();

const {
  listarDepartamentos,
  verDepartamentoJuego,
  mostrarMapa,
  reiniciarDepartamento,
} = require("../controllers/DepartamentoController");

// Listado general de departamentos
router.get("/departamentos", listarDepartamentos);

// Vista del juego (mantiene tu ruta vieja)
router.get("/departamento/:id", verDepartamentoJuego);

router.post("/departamento/:id/reiniciar", reiniciarDepartamento);

router.get("/mapa", mostrarMapa);

module.exports = router;
