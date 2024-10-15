// Importación del archivo de conexión a la base de datos
const db = require('./database');
const util = require('util');

// Promisificación de consultas a la base de datos para evitar el uso de callbacks
const query = util.promisify(db.query).bind(db);

const User = {
    // Obtener todos los usuarios
    async getAll() {
        try {
            // Consulta SQL para obtener todos los usuarios
            return await query('SELECT * FROM usuarios');
        } catch (error) {
            console.error('Error al obtener todos los usuarios:', error);
            throw error; // Lanzar el error para manejarlo en otro lugar si es necesario
        }
    },

    // Obtener un usuario por su ID
    async getById(id) {
        try {
            // Validar que el ID sea un número
            if (isNaN(id)) throw new Error('ID no válido');
            
            // Consulta SQL para obtener un usuario por su ID
            const result = await query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
            if (result.length === 0) throw new Error('Usuario no encontrado');
            return result[0];
        } catch (error) {
            console.error(`Error al obtener el usuario con ID ${id}:`, error);
            throw error; // Lanzar el error para manejarlo en otro lugar si es necesario
        }
    },

    // Crear un nuevo usuario
    async create(data) {
        const { nickname, dni, email, movil, password } = data;
        try {
            // Validar que todos los campos sean proporcionados
            if (!nickname || !dni || !email || !movil || !password) {
                throw new Error('Todos los campos son obligatorios');
            }
            
            // Consulta SQL para insertar un nuevo usuario en la base de datos
            return await query(
                'INSERT INTO usuarios (nickname, dni, email, movil, password) VALUES (?, ?, ?, ?, ?)', 
                [nickname, dni, email, movil, password]
            );
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            throw error; // Lanzar el error para manejarlo en otro lugar si es necesario
        }
    },

    // Actualizar un usuario existente
    async update(id, data) {
        const { nickname, dni, email, movil, password } = data;
        try {
            // Validar que el ID sea un número
            if (isNaN(id)) throw new Error('ID no válido');

            // Validar que todos los campos sean proporcionados
            if (!nickname || !dni || !email || !movil || !password) {
                throw new Error('Todos los campos son obligatorios');
            }
            
            // Consulta SQL para actualizar los datos del usuario por su ID
            const result = await query(
                'UPDATE usuarios SET nickname = ?, dni = ?, email = ?, movil = ?, password = ? WHERE id_usuario = ?', 
                [nickname, dni, email, movil, password, id]
            );

            if (result.affectedRows === 0) throw new Error('Usuario no encontrado o sin cambios');
            return result;
        } catch (error) {
            console.error(`Error al actualizar el usuario con ID ${id}:`, error);
            throw error; // Lanzar el error para manejarlo en otro lugar si es necesario
        }
    },

    // Eliminar un usuario por su ID
    async delete(id) {
        try {
            // Validar que el ID sea un número
            if (isNaN(id)) throw new Error('ID no válido');

            // Consulta SQL para eliminar un usuario por su ID
            const result = await query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
            if (result.affectedRows === 0) throw new Error('Usuario no encontrado');
            return result;
        } catch (error) {
            console.error(`Error al eliminar el usuario con ID ${id}:`, error);
            throw error; // Lanzar el error para manejarlo en otro lugar si es necesario
        }
    }
};

// Exportar el módulo User para que pueda ser utilizado en otros archivos
module.exports = User;
