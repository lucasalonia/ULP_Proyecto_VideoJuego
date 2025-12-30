const express = require("express");
const router = express.Router();
const logroParajeController = require("../controllers/LogroParajeController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post(
  "/logro-paraje",
  verifyToken,
  logroParajeController.guardarLogro
);

module.exports = router;
