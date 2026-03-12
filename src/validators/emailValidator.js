/* Para chequear si el dominio existe (Versión compatible con Redes Universitarias) */
const dns = require("node:dns").promises;

// Forzar a Node a usar IPv4 primero para evitar errores de resolución en redes viejas
dns.setDefaultResultOrder('ipv4first');

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
    /* Cambiamos .resolveMx y .resolve por .lookup
       .lookup usa la misma vía que tu navegador (getaddrinfo), 
       lo cual suele saltarse los bloqueos del Firewall universitario.
    */
    await dns.lookup(dominio);
    
    // Si llega aquí, el dominio existe y responde.
    return null; 
    
  } catch (error) {
    // Si hay un error de conexión o el dominio no existe
    console.error("Error de validación DNS:", error.code);
    return "El dominio del correo no existe o la red bloqueó la validación.";
  }
}

module.exports = { validarEmail };