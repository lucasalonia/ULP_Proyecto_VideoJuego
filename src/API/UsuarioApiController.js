const Usuario = require("../models/Usuario");
const authServiceHashing = require("../Services/authService");
const authApiController = require("./AuthApiController");
const { validarEmail } = require("../validators/emailValidator");
const { validarPassword } = require("../validators/passwordValidator");

const { hashPassword } = authServiceHashing;


async function registrarNuevoUsuario(req, res) {
  const { nickname, email, password, selectedProfileURL } = req.body;

  const rol = "jugador";

  let passwordConfirm = req.body.password_confirm;

  if (!nickname || !email || !password || !passwordConfirm) {
    return res.status(400).json({
      message: "Faltan datos obligatorios: nickname, email, o password.",
    });
  }
  try {

    const errorEmail = await validarEmail(email);
    if (errorEmail) {
      return res.status(400).json({ message: errorEmail });
    }
    const errorPassword = await validarPassword(password);
    if (errorPassword) {
      return res.status(400).json({ message: errorPassword });
    }

    const emailExistente = await Usuario.findUserByMail(email);
    if (emailExistente != null) {
      return res.status(409).json({
        message: "El correo electrónico ya se encuentra registrado.",
      });
    } else if (password !== passwordConfirm) {
      return res.status(400).json({
        message: "Las contraseñas no coinciden.",
      });
    } else {
      const passwordHash = authServiceHashing.hashPassword(password);
      if (!passwordHash) {
        return res.status(500).json({
          message: "Error al procesar la contraseña.",
        });
      }

      let nuevoUsuario = await Usuario.createUser(
        nickname,
        email,
        passwordHash,
        rol,
        selectedProfileURL
      );

      console.log("Usuario creado:", nuevoUsuario.id);
      return res.status(201).json({
        message: "Registro exitoso",
        user: {
          id: nuevoUsuario.id,
          nickname: nuevoUsuario.nickname,
          email: nuevoUsuario.email,
          rol: nuevoUsuario.rol,
        },
      });
    }
  } catch (error) {
    // 6. Manejo de Errores Específicos (excepciones)
    console.error("Error al registrar nuevo usuario:", error);

    // Ejemplo: Manejo de error de email duplicado (Depende de cómo tu ORM/DB lo maneje)
    // Puedes buscar códigos de error específicos de tu ORM o base de datos.
    if (error.code && (error.code === 11000 || error.code === "23505")) {
      return res.status(409).json({
        // 409 Conflict
        message: "El email o nickname ya están registrados.",
      });
    }

    // Error general del servidor
    return res.status(500).json({
      message: "Error interno del servidor al procesar el registro.",
      details: error.message, // Útil para depuración, pero no en producción final.
    });
  }
}
// 2. Modificación de Contraseña
async function modificarContraseña(req, res) {
  try {
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const repetirPassword = req.body.repetirPassword;

    if (!currentPassword || !newPassword || !repetirPassword) {
      return res.status(400).json({
        message: "Faltan datos obligatorios para modificar la contraseña.",
      });
    }

    const usuarioId = res.locals.user.userId;

    if (usuarioId == 0) {
      return res.status(401).json({
        message: "Usuario no autenticado.",
      });
    }
    const usuario = await Usuario.findByPk(usuarioId);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    const passwordMatch = authServiceHashing.comparePassword(
      currentPassword,
      usuario.password_hash
    );

    if (!passwordMatch) {
      return res
        .status(400)
        .json({ message: "La contraseña actual es incorrecta." });
    }
   
    if (newPassword !== repetirPassword) {
      return res
        .status(400)
        .json({ message: "Las nuevas contraseñas no coinciden." });
    }
    const errorPassword = await validarPassword(newPassword);
    if (errorPassword) {
      return res.status(400).json({ message: errorPassword });
    }

    const hashedPassword = authServiceHashing.hashPassword(newPassword);
    const resultado = await Usuario.updatePassword(usuarioId, hashedPassword);
    if (resultado) {
      const updatedUser = await Usuario.findByPk(usuarioId);
      authApiController.setJWTCookie(res, updatedUser);
      return res
        .status(200)
        .json({ message: "Contraseña actualizada con éxito." });
    } else {
      return res
        .status(500)
        .json({ message: "Error al actualizar la contraseña." });
    }
  } catch (error) {
    console.error("Error al modificar la contraseña:", error);
    return res.status(500).json({
      message: "Error interno del servidor al modificar la contraseña.",
      details: error.message,
    });
  }
}
async function modificarNickname(req, res) {
  try {
    const currentPassword = req.body.currentPassword;
    const newNickname = req.body.nickname;

    if (!currentPassword || !newNickname) {
      return res.status(400).json({
        message: "Faltan datos obligatorios para modificar el nickname.",
      });
    }
    const usuarioId = res.locals.user.userId;
    if (usuarioId == 0) {
      return res.status(401).json({
        message: "Usuario no autenticado.",
      });
    }
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    const passwordMatch = authServiceHashing.comparePassword(
      currentPassword,
      usuario.password_hash
    );
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ message: "La contraseña actual es incorrecta." });
    }
    const resultado = await Usuario.updateNickname(usuarioId, newNickname);
    if (resultado) {
      const updatedUser = await Usuario.findByPk(usuarioId);
      authApiController.setJWTCookie(res, updatedUser);
      return res
        .status(200)
        .json({ message: "Nickname actualizado con éxito." });
    } else {
      return res
        .status(500)
        .json({ message: "Error al actualizar el nickname." });
    }
  } catch (error) {
    console.error("Error al modificar el nickname:", error);
    return res.status(500).json({
      message: "Error interno del servidor al modificar el nickname.",
      details: error.message,
    });
  }
}

async function modificarFoto(req, res) {
  try {
    const newProfileURL = req.body.fotoUrl;
    if (!newProfileURL) {
      return res.status(400).json({
        message: "Faltan datos obligatorios para modificar la foto de perfil.",
      });
    }
    const usuarioId = res.locals.user.userId;
    if (usuarioId == 0) {
      return res.status(401).json({
        message: "Usuario no autenticado.",
      });
    }
    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    const resultado = await Usuario.updateProfilePicture(
      usuarioId,
      newProfileURL
    );
    if (resultado) {
      const updatedUser = await Usuario.findByPk(usuarioId);
      authApiController.setJWTCookie(res, updatedUser);
      return res
        .status(200)
        .json({ message: "Foto de perfil actualizada con éxito." });
    } else {
      return res
        .status(500)
        .json({ message: "Error al actualizar la foto de perfil." });
    }
  } catch (error) {
    console.error("Error al modificar la foto de perfil:", error);
    return res.status(500).json({
      message: "Error interno del servidor al modificar la foto de perfil.",
      details: error.message,
    });
  }
}

module.exports = {
  registrarNuevoUsuario,
  modificarContraseña,
  modificarNickname,
  modificarFoto,
};
