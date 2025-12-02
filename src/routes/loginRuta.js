const express = require("express");
const router = express.Router();
const authController = require('../API/AuthApiController');
const usuarioController = require('../API/UsuarioApiController');

/*GET*/
//Vistas
router.get("/login", (req, res) => {
    const registro = req.query.registro; 
    res.render("login/login", { registro });
});

router.get("/register", (req, res) => res.render("login/register"));
router.get("/guest", (req, res) => res.render("login/guest"));



/*POST*/
//Api
router.post('/api/login', authController.loginApi);
router.delete('/api/logout', authController.logoutApi);

router.post("/api/register", usuarioController.registrarNuevoUsuario);

router.post("/guest", (req, res) => {
  // TODO: guardar nickname en sesión o cookie temporal
  const { nickname } = req.body;
  console.log("Jugador invitado:", nickname);
  res.redirect("/");
});

module.exports = router;
