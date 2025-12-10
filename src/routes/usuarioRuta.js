const express = require("express");
const router = express.Router();
const usuarioController = require('../API/UsuarioApiController');

/*GET*/
//Vistas
router.get("/perfil", (req, res) => res.render("usuario/perfil"));


/*POST*/
//Acciones
router.post("/perfil/modificar-contrasenia", usuarioController.modificarContraseña);
router.post("/perfil/modificar-nickname", usuarioController.modificarNickname);
router.post("/perfil/modificar-foto", usuarioController.modificarFoto);
// router.post("/cambiar-nickname", usuarioController.cambiarNickname);


module.exports = router;