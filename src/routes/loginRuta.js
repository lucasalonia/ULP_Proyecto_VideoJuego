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
router.get("/recover", (req, res) => res.render("login/recover"));

/*Segundo paso en la recuperacion de la contraseña:
Este endpoint recibe el token como parámetro de ruta el cual es solicitado por el usuario al hacer click en el enlace enviado por mail en recoverPasword.
El token se almacena en una variable es cual puede procesar la vista. Este se asigna como valor a un input escondido en el formulario de la vista*/
router.get("/reset-password/:token", (req, res) => {
    authController.verifyTokenPromise(req, res).then((isValid) => {
        if (isValid) {
            const token = req.params.token;
            res.render("login/reset-password", { token });
        } else {
            res.render("login/token-expirado", { token: null, error: "El enlace de restablecimiento de contraseña es inválido o ha expirado." });
        }
    });
});



/*POST*/
//Api
router.post('/api/login', authController.loginApi);
router.delete('/api/logout', authController.logoutApi);

/*Primer paso en la recuperacion de la contraseña: 
recoverPassword generara un token en caso de ser posible y enviará un email al usuario con el link para resetear su contraseña*/
router.post("/api/recover", authController.recoverPassword);

/*Tercer paso en la recuperacion de la contraseña:
/ resetPassword validará el token y actualizará la contraseña del usuario. Se envia el formulario desde la vista reset-password*/
router.post("/api/reset-password", authController.resetPassword);

router.post("/api/register", usuarioController.registrarNuevoUsuario);

router.post("/api/guest", (req, res) => {
  authController.guestLogin(req, res);
  
});

module.exports = router;
