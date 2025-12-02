const bcrypt = require('bcrypt');
const { findUserByMail } = require('../models/Usuario'); 


/**
 * Uso de JSDoc
 * @function authenticateUser
 * Busca un usuario por mail y verifica la contraseña hasheada (BCrypt).
 * @param {string} mail El mail de usuario.
 * @param {string} password La contraseña en texto plano.
 * @returns {object | null} El objeto usuario (con Rol) si es válido, o null.
 */

async function authenticateUser(mail, password) {
    try {
       
        const user = await findUserByMail(mail); 
        if (!user) {
            return null;
        }
        

        const isPasswordValid = await bcrypt.compare(password, user.password_hash); 

        if (!isPasswordValid) {
            return null;
        }


        return user;
    } catch (error) {
        console.error('Error en authService.authenticateUser:', error);
        return null;
    }
}

/**
 * @function hashPassword
 * Hashea una contraseña usando bcrypt (equivalente a HashearContraseña).
 */
function hashPassword(password) {
    
    return bcrypt.hashSync(password, 12); 
}

function comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
}


module.exports = {
    authenticateUser,
    hashPassword,
    comparePassword
};