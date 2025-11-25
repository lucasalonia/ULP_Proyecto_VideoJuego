// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const ISSUER = process.env.JWT_ISSUER;
const AUDIENCE = process.env.JWT_AUDIENCE;


function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1]; 
  
    if (!token && req.cookies) {
        token = req.cookies.jwt_token;
    }

    if (req.path === '/login' || req.path === '/login' || req.path === '/register' || req.path === '/guest') {
        
        return next();
    }
    if (token == null) {
        console.log('Acceso denegado. Token no proporcionado.');
        return res.redirect('/login'); 
    }

    
    const options = {
        issuer: ISSUER,
        audience: AUDIENCE,
    };

    jwt.verify(token, SECRET_KEY, options, (err, payload) => {
        if (err) {
            console.error("Error de token:", err.message);
            return res.status(403).json({ message: 'Token inválido o expirado.' }); 
        }
        
       
        req.user = payload; 
        next(); // Continuar con la función del controlador
    });
}

// Middleware para políticas de Autorización (similar a policy.RequireRole("admin"))
function authorize(requiredRole) {
    return (req, res, next) => {
        // req.user fue establecido por verifyToken
        if (req.user && req.user.role === requiredRole) {
            next(); // Rol permitido
        } else {
            res.status(403).json({ message: 'No tiene permisos para este recurso.' }); 
        }
    };
}

module.exports = { verifyToken, authorize };