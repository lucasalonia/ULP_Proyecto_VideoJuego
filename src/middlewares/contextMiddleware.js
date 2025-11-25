
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
                userName: decoded.name || 'Usuario', 
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