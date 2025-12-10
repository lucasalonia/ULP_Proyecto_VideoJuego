const express = require("express");
const router = express.Router();
const controlador =require("../controllers/LogroControlador")
router.get("/logros/perfil/ultimos", controlador.obtenerUltimosLogros);
router.post("/tiempo_mapa", controlador.guardarTiempo)
router.get('/logros', controlador.obtenerLogros);
router.get('/logros/:departamentoId', controlador.obtenerLogros);


module.exports = router;