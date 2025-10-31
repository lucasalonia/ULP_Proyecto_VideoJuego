const express = require("express");
const router = express.Router();

// 🔐 LOGIN
router.get("/login", (req, res) => res.render("login/login"));
router.post("/login", (req, res) => {
  // TODO: validar email y password
  res.redirect("/"); // redirigir al inicio o juego
});

// 🧾 REGISTER
router.get("/register", (req, res) => res.render("login/register"));
router.post("/register", (req, res) => {
  // TODO: guardar nickname, email, password en BD
  const { nickname } = req.body;
  console.log("Nuevo usuario:", nickname);
  res.redirect("/");
});

// 🎮 GUEST (modo sin cuenta)
router.get("/guest", (req, res) => res.render("login/guest"));
router.post("/guest", (req, res) => {
  // TODO: guardar nickname en sesión o cookie temporal
  const { nickname } = req.body;
  console.log("Jugador invitado:", nickname);
  res.redirect("/");
});

module.exports = router;
