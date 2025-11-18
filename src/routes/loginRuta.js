const express = require("express");
const router = express.Router();
const authController = require('../API/AuthApiController');





/*GET*/
//Vistas
router.get("/login", (req, res) => res.render("login/login"));
router.get("/register", (req, res) => res.render("login/register"));
router.get("/guest", (req, res) => res.render("login/guest"));



/*POST*/
//Api
router.post('/api/login', authController.loginApi);
router.delete('/api/logout', authController.logoutApi);

router.post("/register", (req, res) => {
  // TODO: guardar nickname, email, password en BD
  const { nickname } = req.body;
  console.log("Nuevo usuario:", nickname);
  res.redirect("/");
});

router.post("/guest", (req, res) => {
  // TODO: guardar nickname en sesión o cookie temporal
  const { nickname } = req.body;
  console.log("Jugador invitado:", nickname);
  res.redirect("/");
});

module.exports = router;
