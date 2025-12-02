const express = require("express");
const router = express.Router();
const logroParajeController = require("../controllers/LogroParajeController");

router.post("/logro-paraje", logroParajeController.guardarLogro);

module.exports = router;
