const jwt = require("jsonwebtoken");
const authService = require("../Services/authService");

const { authenticateUser } = authService;

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const ISSUER = process.env.JWT_ISSUER;
const AUDIENCE = process.env.JWT_AUDIENCE;

/**
 * @function loginApi
 * Maneja la solicitud POST /api/login y genera el JWT.
 * Equivalente a AuthApiController.LoginApi.
 */
async function loginApi(req, res) {
  const { mail, password } = req.body;

  if (!mail || !password) {
    return res
      .status(400)
      .json({ message: "Datos inválidos. Faltan credenciales." });
  }

  const user = await authenticateUser(mail, password);

  if (!user) {
    return res
      .status(401)
      .json({ message: "Usuario o contraseña incorrectos." });
  }

  // ¡AJUSTE CLAVE! El Payload/Claims del Token
  const payload = {
    // ClaimTypes.NameIdentifier -> Usamos 'usuario_id'
    sub: user.usuario_id,
    // ClaimTypes.Name -> Usamos 'nombre'
    name: user.nombre,
    // Rol -> Usamos 'rol' (o 'role' si se renombró en la consulta)
    role: user.rol,

    iss: ISSUER,
    aud: AUDIENCE,
  };

  // Generar el Token (utilizando la configuración de 4 horas como en C#)
  const expirationHours = 4;
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: `${expirationHours}h`,
  });

  // Devolver el token y la expiración
  const expirationTime = new Date(
    Date.now() + expirationHours * 60 * 60 * 1000
  );

  res.cookie("jwt_token", token, {
    httpOnly: true, // El JS del navegador NO puede leerla (anti-XSS)
    secure: process.env.NODE_ENV === "production", // Solo si usas HTTPS
    expires: expirationTime,
    sameSite: "strict",
  });

  return res.json({
    message: "Login exitoso. Token establecido en cookie.",
    userId: user.usuario_id,
  });
}

/**
 * @function logoutApi
 * Maneja la solicitud POST /api/logout.
 */
function logoutApi(req, res) {

  res.cookie("jwt_token", "loggedout", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 10 * 1000), 
        maxAge: 0, 
        sameSite: "strict",
    });

    return res.status(200).json({
        message: "Sesión cerrada con éxito. Token de sesión eliminado.",
    })
}

async function registrarNuevoUsuario(req, res) {
  const { nickname } = req.body;
  console.log("Nuevo usuario:", nickname);
}

module.exports = {
  loginApi,
  logoutApi,
  registrarNuevoUsuario
};
