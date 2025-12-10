const jwt = require("jsonwebtoken");
const authService = require("../Services/authService");
const Usuario = require("../models/Usuario");
const { sendMail } = require("../Services/sendMail");
const { validarPassword } = require("../validators/passwordValidator");

const { authenticateUser } = authService;
const { hashPassword } = authService;

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

  const usuario = await authenticateUser(mail, password);

  if (!usuario) {
    return res
      .status(401)
      .json({ message: "Usuario o contraseña incorrectos." });
  }

  // Usar la función centralizada para establecer la cookie
  setJWTCookie(res, usuario);

  return res.json({
    message: "Login exitoso. Token establecido en cookie.",
    userId: usuario.usuario_id,
  });
}

/**
 * @function logoutApi
 * Maneja la solicitud POST /api/logout.
 */
async function logoutApi(req, res) {
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

/**
 * @function recoverPassword
 * La función $recoverPassword$ gestiona el proceso de solicitud de restablecimiento de contraseña.
 * Primero, verifica que se haya proporcionado un correo electrónico.
 *  Si el correo existe en la base de datos, genera un token temporal (JWT) de 5 minutos, construye un enlace de restablecimiento y,
 *  finalmente, envía este enlace por correo electrónico al usuario. Si no encuentra el correo o si hay un error en el envío, retorna el mensaje de error correspondiente.
 */
async function recoverPassword(req, res) {
  try {
    const { mail } = req.body;

    if (!mail) {
      return res.status(400).json({ message: "Debes ingresar un correo." });
    }

    const user = await Usuario.findUserByMail(mail);
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "Correo no registrado." });
    }

    const token = jwt.sign(
      {
        sub: user.usuario_id,
        mail: user.mail,
        type: "password-reset",
      },
      SECRET_KEY,
      {
        expiresIn: "10m",
        issuer: ISSUER,
        audience: AUDIENCE,
      }
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Enviar email
    await sendMail(
      user.mail,
      "Restablecer contraseña",
      `
      <table style="width: 100%; font-family: 'Roboto', Arial, sans-serif; background-color: #eeeeee; padding: 20px;">
          <tr>
              <td align="center">
                  <table style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-collapse: collapse;">
                      
                      <tr>
                          <td style="padding: 20px; background-color: #2766be; border-top-left-radius: 12px; border-top-right-radius: 12px; text-align: center;">
                              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Restablecimiento de Contraseña para "Comarcas de San Luis"</h1>
                          </td>
                      </tr>

                      <tr>
                          <td style="padding: 30px; color: #333333;">
                              <h2 style="font-size: 20px; margin-top: 0; margin-bottom: 20px;">Hola! </h2>
                              
                              <p style="margin-bottom: 25px; line-height: 1.6;">Recibiste este correo porque solicitaste el restablecimiento de tu contraseña. Hacé clic en el botón de abajo para cambiarla:</p>
                              
                              <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 30px;">
                                  <tr>
                                      <td align="center" style="padding-top: 10px; padding-bottom: 10px;">
                                          <a href="${resetLink}" 
                                            target="_blank" 
                                            style="display: inline-block; padding: 12px 25px; background-color: #2766be; color: #ffffff; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; border: 1px solid #205bac;">
                                              Cambiar mi Contraseña
                                          </a>
                                      </td>
                                  </tr>
                              </table>

                              <p style="margin-top: 10px; margin-bottom: 5px; font-size: 14px; text-align: center;">Si el botón no funciona, copiá y pegá el siguiente enlace:</p>
                              <p style="text-align: center; word-break: break-all;"><a href="${resetLink}" style="color: #2766be; font-size: 14px; text-decoration: underline;">${resetLink}</a></p>

                              <p style="margin-top: 30px; margin-bottom: 0; font-size: 13px; color: #888888; text-align: center;">Este enlace expira en **10 minutos** y solo puede ser usado una vez.</p>
                              
                          </td>
                      </tr>

                      <tr>
                          <td style="padding: 15px; background-color: #f5f5f5; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; text-align: center;">
                              <p style="margin: 0; font-size: 12px; color: #888888;">© ULP - Comarcas de San Luis| Todos los derechos reservados.</p>
                          </td>
                      </tr>

                  </table>
              </td>
          </tr>
      </table>
      `
    );

    return res.json({
      message: "Se envió un enlace a tu email para restablecer la contraseña.",
    });
  } catch (error) {
    console.error("ERROR EN recoverPassword:", error);

    return res.status(500).json({
      message: "Error interno del servidor al enviar el correo.",
      error: error.message,
    });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, newPassword, passwordConfirm } = req.body;

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "La contraseña debe tener al menos 6 caracteres." });
    }

    if (!token || !newPassword || !passwordConfirm) {
      return res.status(400).json({ message: "Datos incompletos." });
    }
    if (newPassword !== passwordConfirm) {
      return res.status(400).json({ message: "Las contraseñas no coinciden." });
    }
    let payload;
    try {
      payload = jwt.verify(token, SECRET_KEY, {
        issuer: ISSUER,
        audience: AUDIENCE,
      });
    } catch (err) {
      return res.status(400).json({ message: "Token inválido o expirado." });
    }
    if (payload.type !== "password-reset") {
      return res.status(400).json({ message: "Token inválido." });
    }
    const userId = payload.sub; //Proporcionado por el Token. Ver recoverPassword
    const user = await Usuario.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const errorPassword = await validarPassword(newPassword);
    if (errorPassword) {
      return res.status(400).json({ message: errorPassword });
    }
    const passwordHashed = hashPassword(newPassword);
    await Usuario.updatePassword(user.usuario_id, passwordHashed);
    return res.json({ message: "Contraseña actualizada con éxito." });
  } catch (error) {
    console.error("ERROR EN resetPassword:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
}
/**
 * @function tokenVerification
 * Verifica la validez y expiración del token de restablecimiento.
 */
/**
 * @function verifyTokenPromise
 * Verifica la validez y expiración del token de restablecimiento.
 * Devuelve una Promesa que se resuelve con true o false.
 */
async function verifyTokenPromise(req) {
  const token = req.params.token;

  try {
    if (!token) {
      return false;
    }

    jwt.verify(token, SECRET_KEY);

    return true;
  } catch (error) {
    return false;
  }
}

async function guestLogin(req, res) {
  const { nickname } = req.body;

  if (!nickname || nickname.trim() === "") {
    return res.status(400).json({
      message: "Debes ingresar un nickname para jugar como invitado.",
    });
  }

  const invitado = {
    usuario_id: `guest_${Date.now()}`, 
    nombre: nickname.trim(),
    imagen_perfil: null,
    mail: null,
    rol: "guest",
  };

  setJWTCookie(res, invitado);

  return res.json({
    message: "Sesión de invitado iniciada.",
    nickname: invitado.nombre,
    role: invitado.rol,
  });
}

module.exports = {
  loginApi,
  logoutApi,
  setJWTCookie,
  recoverPassword,
  resetPassword,
  verifyTokenPromise,
  guestLogin,
};
