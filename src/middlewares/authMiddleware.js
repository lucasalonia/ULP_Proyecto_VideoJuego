// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const ISSUER = process.env.JWT_ISSUER;
const AUDIENCE = process.env.JWT_AUDIENCE;


function verifyToken(req, res, next) {
    
    const PUBLIC_PATHS = [
        '/login', 
        '/register', 
        '/guest', 
        '/recover',
        '/.well-known/appspecific/com.chrome.devtools.json',
        '/reset-password'
    ];
    
    const isPublicPath = PUBLIC_PATHS.includes(req.path); 

    if (isPublicPath) {
        return next();
    }
    
    let token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]; 

    if (!token && req.cookies) {
        token = req.cookies.jwt_token;
    }

    if (token == null) {
        console.log(`Acceso denegado a ${req.path}. Token no proporcionado.`);
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
        next(); 
    });
}

function authorize(requiredRole) {
    return (req, res, next) => {
        if (req.user && req.user.role === requiredRole) {
            next();
        } else {
            res.status(403).json({ message: 'No tiene permisos para este recurso.' }); 
        }
    };
}

module.exports = { verifyToken, authorize };