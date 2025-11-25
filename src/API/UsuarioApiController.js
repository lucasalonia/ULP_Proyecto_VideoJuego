const Usuario = require("../models/Usuario");
const authServiceHashing = require("../Services/authService");

const { hashPassword } = authServiceHashing;

async function registrarNuevoUsuario(req, res) {
  const { nickname, email, password, selectedProfileURL } = req.body;
  const rol = "jugador";

  if (!nickname || !email || !password) {
    return res.status(400).json({
      message: "Faltan datos obligatorios: nickname, email, o password.",
    });
  }

  try {
    const emailExistente = await Usuario.findUserByMail(email);

    if (emailExistente != null) {
        
        return res.status(409).json({
            message: "El correo electrónico ya se encuentra registrado."
        })
    } else {
      const passwordHash = authServiceHashing.hashPassword(password);

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

module.exports = {
  registrarNuevoUsuario,
};
