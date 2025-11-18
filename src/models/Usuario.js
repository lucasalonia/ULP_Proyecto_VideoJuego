const pool = require("../config/db"); 

const Usuario = {

    async findUserByMail(mail) {
        const query = `
            SELECT 
                usuario_id, 
                nombre, 
                mail, 
                password_hash, 
                rol,
                imagen_perfil,
                nombre 
            FROM usuario
            WHERE mail = ?
        `;
        
        const [[usuario]] = await pool.query(query, [mail]);
        
        return usuario;
    },
 
    async getRoleByUserId(userId) {
        const query = "SELECT rol FROM usuario WHERE usuario_id = ?";
        const [[result]] = await pool.query(query, [userId]);
        return result ? result.rol : null;
    },
    async createUser(nombre, mail, passwordHash, rol, imagenPerfil) {
        const query = `
            INSERT INTO usuario (nombre, mail, password_hash, rol, imagen_perfil) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        // La URL de la foto de perfil debe ser la ruta relativa, e.g., 'profiles/mi_foto.jpg'
        const [result] = await pool.query(query, [nombre, mail, passwordHash, rol, imagenPerfil]);

        // Retorna el ID del usuario insertado
        return result.insertId; 
    }
};

module.exports = Usuario;