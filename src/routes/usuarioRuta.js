const express = require("express");
const router = express.Router();

/*GET*/
//Vistas
router.get("/perfil", (req, res) => res.render("usuario/perfil"));


module.exports = router;