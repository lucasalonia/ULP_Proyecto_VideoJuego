// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const ISSUER = process.env.JWT_ISSUER;
const AUDIENCE = process.env.JWT_AUDIENCE;

function verifyToken(req, res, next) {
  const PUBLIC_PATHS = [
    "/login",
    "/register",
    "/guest",
    "/recover",
    "/reset-password",
    "/favicon.ico",
    "/.well-known/appspecific/com.chrome.devtools.json",
  ];

  // Permitir rutas públicas
  if (PUBLIC_PATHS.includes(req.path)) {
    return next();
  }

  let token = null;

  // 1) Authorization header
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2) Cookie (login por vistas)
  if (!token && req.cookies?.jwt_token) {
    token = req.cookies.jwt_token;
  }

  if (!token) {
    console.log(`Acceso denegado a ${req.path}. Token no proporcionado.`);
    return res.redirect("/login");
  }

  const options = {
    issuer: ISSUER,
    audience: AUDIENCE,
  };

  jwt.verify(token, SECRET_KEY, options, (err, payload) => {
    if (err) {
      console.error("Error de token:", err.message);
      return res.redirect("/login");
    }
    
    console.log("JWT PAYLOAD REAL:", payload); // 🔴 CLAVE
    // 🔑 NORMALIZACIÓN CENTRAL DEL USUARIO
    req.user = {
      userId: payload.usuario_id ?? payload.sub,
      usuario_id: payload.usuario_id ?? payload.sub, // opcional
      role: payload.role,
      email: payload.email,
    };


    if (!req.user.usuario_id) {
      console.error("Token válido pero sin usuario_id:", payload);
      return res.redirect("/login");
    }

    next();
  });
}

function authorize(requiredRole) {
  return (req, res, next) => {
    if (req.user?.role === requiredRole) {
      return next();
    }
    return res.status(403).json({
      message: "No tiene permisos para este recurso.",
    });
  };
}

module.exports = { verifyToken, authorize };
