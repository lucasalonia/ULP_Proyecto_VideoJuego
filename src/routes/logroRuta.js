const express = require("express");
const router = express.Router();
const controlador = require("../controllers/LogroControlador")
router.get("/logros/perfil/ultimos", controlador.obtenerUltimosLogros);
const { verifyToken } = require("../middlewares/authMiddleware");
router.post(
    "/tiempo_mapa",
    verifyToken,
    controlador.guardarTiempo
);
router.get('/logros', controlador.obtenerLogros);
router.get('/logros/:departamentoId', controlador.obtenerLogros);


module.exports = router;