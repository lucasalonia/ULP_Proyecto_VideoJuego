/**
 * @function globalPugContext
 * @description Middleware que inyecta el contexto de usuario (user) en res.locals para todas las vistas Pug.
 * Verifica la existencia y validez del token JWT en la cookie 'jwt_token'.
 * Si el token es válido, adjunta los datos del usuario (id, nombre, foto, rol) y establece isAuthenticated en true.
 * Si el token es inválido o no existe, establece el usuario como 'Invitado' (isAuthenticated: false).
 * * Este patrón asegura que las variables de sesión y autenticación estén disponibles automáticamente
 * en todos los parciales y layouts de Pug (ej: navbar.pug) sin tener que pasarlas manualmente en res.render().
 * * @param {object} req - Objeto de solicitud de Express
 * @param {object} res - Objeto de respuesta de Express
 * @param {function} next - Función para pasar el control al siguiente middleware/controlador
 */
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET_KEY; 

function globalPugContext(req, res, next) {
    //Buscamos el token creado en AuthApiController
    const token = req.cookies.jwt_token;

    //Definimos locales por defecto para invitados
    res.locals.user = { 
        isAuthenticated: false,
        userName: 'Invitado',
        fotoUrl: '/img/avatar-default.png' 
    };

    if (token) {
        try {
 
            const decoded = jwt.verify(token, SECRET_KEY);
            
            //Si existe un usuario registrado las variables locales de res las definimos con sus datos
            res.locals.user = {
                isAuthenticated: true,
                userId: decoded.sub || 0,
                userName: decoded.name || 'Usuario', 
                userMail : decoded.mail || '',
                fotoUrl: decoded.fotoUrl || '/img/profiles/avatar-default.png',
                rol: decoded.role 
            };
        } catch (err) {
            
            res.clearCookie("jwt_token");
        }
    }
    
    next();
}

module.exports = { globalPugContext };