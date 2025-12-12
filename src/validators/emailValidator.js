/*Para chequear si el dominio existe*/ 
const dns = require("dns").promises;

const dominiosTemporales = [
  "yopmail.com",
  "tempmail.com",
  "10minutemail.com",
  "dispostable.com",
  "guerrillamail.com",
  "mailinator.com"
];

async function validarEmail(email) {
  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formatoEmail.test(email)) {
    return "El formato del correo electrónico no es válido.";
  }

  const dominio = email.split("@")[1].toLowerCase();

  if (dominiosTemporales.includes(dominio)) {
    return "No se permiten correos temporales. Usa un email válido.";
  }

  try {
    const registrosMx = await dns.resolveMx(dominio);
    if (!registrosMx || registrosMx.length === 0) {
      return "El dominio del email no tiene registros MX válidos.";
    }
  } catch (mxError) {
    try {
     
      const registrosA = await dns.resolve(dominio);
      if (!registrosA || registrosA.length === 0) {
        return "El dominio del correo no existe.";
      }
    } catch (aError) {
      return "El dominio del correo no existe.";
    }
  }


  return null;
}


module.exports = { validarEmail };