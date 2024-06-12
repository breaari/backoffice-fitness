import axios from 'axios';

export const isValidCategoriaSubcategoria = async (categoriaId) => {
  try {

    if (!categoriaId || typeof categoriaId !== 'string' || categoriaId.trim() === '') {
      return { valid: false, error: 'La categoría es requerida' };
    }

    try {
      const response = await axios.get(`/categorias/${categoriaId}`);
      if (response.status === 200 && response.data) {
        return { valid: true, error: '' };
      } else {
        return { valid: false, error: 'La categoría no existe' };
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { valid: false, error: 'La categoría no existe' };
      }
      return { valid: false, error: 'Error al verificar la categoría' };
    }
  } catch (error) {
    return { valid: false, error: 'Error al validar la categoría' };
  }
};
