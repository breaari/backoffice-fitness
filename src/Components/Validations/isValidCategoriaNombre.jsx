import axios from "axios";

export const isValidCategoriaNombre = async (nombre) => {
    try {
        if (!nombre) {
            return { valid: false, error: 'La categoria es requerida' };
        }

        if (nombre.length > 100) {
            return { valid: false, error: 'La categoria no debe tener más de 100 caracteres' };
        }

        if (nombre.trim() !== nombre) {
            return { valid: false, error: 'La categoria no debe contener espacios al inicio o al final' };
        }

        if (!/^[a-zA-Z\s]+$/.test(nombre.trim())) {
            return { valid: false, error: 'La categoria solo puede contener letras' };
        } 

        const response = await axios.get('/categorias');
        const categorias = response.data.categorias;

        const categoriaExistente = categorias.length > 0 && categorias.find(categoria => categoria.nombre.toLowerCase() === nombre.toLowerCase());

        if (categoriaExistente) {
            return { valid: false, error: 'Ya existe una categoría con ese nombre' };
        }
        console.log("Categorias:", categorias)
        return { valid: true };

    } catch (error) {
        console.error('Error al validar el nombre de la categoría:', error);
        return { valid: false, error: 'Error al validar el nombre de la categoría' };
    }
};


