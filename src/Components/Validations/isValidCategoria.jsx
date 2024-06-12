export const isValidCategoria = (categoria) => {
    try {
      if (!categoria || typeof categoria !== 'string' || categoria.trim() === '') {
        return { valid: false, error: 'La categoría es requerida' };
      }
  
      return { valid: true, error: '' };
    } catch (error) {
      return { valid: false, error: 'Error al validar categoría'};
    }
  };
