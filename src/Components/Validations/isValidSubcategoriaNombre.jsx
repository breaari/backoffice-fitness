import axios from "axios";

export const isValidSubcategoriaNombre = async (nombre, categoriaId) => {
    try {
        if (!nombre) {
            return { valid: false, error: 'La subcategoría es requerida' };
        }

        if (nombre.length > 100) {
            return { valid: false, error: 'La subcategoría no debe tener más de 100 caracteres' };
        }

        if (nombre.trim() !== nombre) {
            return { valid: false, error: 'La subcategoría no debe contener espacios al inicio o al final' };
        }

        if (!/^[a-zA-ZñÑ\s]+$/.test(nombre.trim())) {
            return { valid: false, error: 'La subcategoría solo puede contener letras y la letra "ñ"' };
        }

        const response = await axios.get('/subcategorias');
        const subcategorias = response.data.subcategorias;

        const subcategoriaExistente = subcategorias.find(subcategoria => 
            subcategoria.nombre.toLowerCase() === nombre.toLowerCase() &&
            subcategoria.categoriaId === categoriaId
        );

        if (subcategoriaExistente) {
            return { valid: false, error: 'Ya existe una subcategoría con ese nombre en la categoría que seleccionaste' };
        }

        return { valid: true };

    } catch (error) {
        console.error('Error al validar el nombre de la subcategoría:', error);
        return { valid: false, error: 'Error al validar el nombre de la subcategoría' };
    }
};
