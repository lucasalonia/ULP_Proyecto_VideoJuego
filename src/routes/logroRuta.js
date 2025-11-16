const express = require("express");
const router = express.Router();
const controlador =require("../controllers/LogroControlador")

router.post("/tiempo_mapa", controlador.guardarTiempo)
module.exports = router;