const { pwnedPassword } = require("hibp");

const blacklist = [
  "123456",
  "password",
  "qwerty",
  "111111",
  "abc123",
  "admin",
  "123123",
  "iloveyou",
];

async function validarPassword(password) {
  if (!password) return "Debes ingresar una contraseña.";

  if (password.length < 6) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }

  if (blacklist.includes(password.toLowerCase())) {
    return "La contraseña es demasiado común.";
  }

  const pwnCount = await pwnedPassword(password);
  if (pwnCount > 0) {
    return "La contraseña aparece en filtraciones. Elegí otra.";
  }

  return null;
}

module.exports = { validarPassword };
