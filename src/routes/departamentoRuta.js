const express = require("express");
const router = express.Router();

const {
  listarDepartamentos,
  verDepartamentoJuego,
  verDepartamentoDetalle,
} = require("../controllers/DepartamentoController");

// 🧭 Listado general de departamentos
router.get("/departamentos", listarDepartamentos);

// 🎮 Vista del juego (mantiene tu ruta vieja)
router.get("/departamento/:id", verDepartamentoJuego);

// 📄 Detalle textual de un departamento
router.get("/departamento/:id/detalle", verDepartamentoDetalle);

module.exports = router;
