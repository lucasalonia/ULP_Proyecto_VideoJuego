const jwt = require("jsonwebtoken");
const authService = require("../Services/authService");

const { authenticateUser } = authService;

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const ISSUER = process.env.JWT_ISSUER;
const AUDIENCE = process.env.JWT_AUDIENCE;
const EXPIRATION_HOURS = 4;

/**
 * @function setJWTCookie
 * Genera el JWT y establece la cookie 'jwt_token' en la respuesta.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {object} usuario - Objeto de usuario con sus propiedades esenciales (usuario_id, nombre, imagen_perfil, etc.).
 */

function setJWTCookie(res, usuario) {
  const payload = {
    sub: usuario.usuario_id,
    name: usuario.nombre,
    fotoUrl: usuario.imagen_perfil,
    mail: usuario.mail,
    role: usuario.rol,
    iss: ISSUER,
    aud: AUDIENCE,
  };

  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: `${EXPIRATION_HOURS}h`,
  });

  const expirationTime = new Date(
    Date.now() + EXPIRATION_HOURS * 60 * 60 * 1000
  );

  res.cookie("jwt_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expirationTime,
    sameSite: "strict",
  });

  return token;
}

/**
 * @function loginApi
 * Maneja la solicitud POST /api/login y genera el JWT.
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

  // Usar la función centralizada para establecer la cookie
  setJWTCookie(res, user);

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
  // Elimina la cookie de manera efectiva
  res.cookie("jwt_token", "loggedout", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // Fuerza la expiración inmediata
    sameSite: "strict",
  });

  return res.status(200).json({
    message: "Sesión cerrada con éxito. Token de sesión eliminado.",
  });
}

module.exports = {
  loginApi,
  logoutApi,
  setJWTCookie,
};
