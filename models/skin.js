const connection = require('./database');

const Skin = {
    // Obtener todas las skins
    async getAll() {
        const query = 'SELECT * FROM skins';
        try {
            // Ejecutar la consulta para obtener todas las skins
            const [rows] = await connection.query(query);
            return rows;
        } catch (error) {
            console.error('Error al obtener todas las skins:', error);
            throw error; // Lanzar el error para manejarlo en otro lugar si es necesario
        }
    },

    // Obtener una skin por ID
    async getById(id) {
        try {
            // Validar que el ID sea un número
            if (isNaN(id)) throw new Error('ID no válido');

            const query = 'SELECT * FROM skins WHERE id_skin = ?';
            const [rows] = await connection.query(query, [id]);

            if (rows.length === 0) throw new Error('Skin no encontrada');
            return rows[0]; // Devolver la primera fila (solo debe haber una)
        } catch (error) {
            console.error(`Error al obtener la skin con ID ${id}:`, error);
            throw error; // Lanzar el error para manejarlo en otro lugar si es necesario
        }
    },

    // Crear una nueva skin
    async create(skin) {
        try {
            // Validar que se proporcione un objeto de skin válido
            if (!skin || Object.keys(skin).length === 0) {
                throw new Error('Datos de skin no válidos');
            }

            const query = 'INSERT INTO skins SET ?';
            const result = await connection.query(query, [skin]);

            return result.insertId; // Devolver el ID de la nueva skin creada
        } catch (error) {
            console.error('Error al crear la skin:', error);
            throw error; // Lanzar el error para manejarlo en otro lugar si es necesario
        }
    },

    // Actualizar una skin existente
    async update(id, skin) {
        try {
            // Validar que el ID sea un número
            if (isNaN(id)) throw new Error('ID no válido');

            // Validar que se proporcione un objeto de skin válido
            if (!skin || Object.keys(skin).length === 0) {
                throw new Error('Datos de skin no válidos para la actualización');
            }

            const query = 'UPDATE skins SET ? WHERE id_skin = ?';
            const result = await connection.query(query, [skin, id]);

            if (result.affectedRows === 0) throw new Error('Skin no encontrada o sin cambios');
            return result.affectedRows; // Devolver la cantidad de filas afectadas
        } catch (error) {
            console.error(`Error al actualizar la skin con ID ${id}:`, error);
            throw error; // Lanzar el error para manejarlo en otro lugar si es necesario
        }
    },

    // Eliminar una skin
    async delete(id) {
        try {
            // Validar que el ID sea un número
            if (isNaN(id)) throw new Error('ID no válido');

            const query = 'DELETE FROM skins WHERE id_skin = ?';
            const result = await connection.query(query, [id]);

            if (result.affectedRows === 0) throw new Error('Skin no encontrada');
            return result.affectedRows; // Devolver la cantidad de filas afectadas
        } catch (error) {
            console.error(`Error al eliminar la skin con ID ${id}:`, error);
            throw error; // Lanzar el error para manejarlo en otro lugar si es necesario
        }
    }
};

module.exports = Skin;
