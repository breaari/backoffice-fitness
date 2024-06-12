import axios from 'axios';

export const getCategorias = async () => {
  try {
    const response = await axios.get('/categorias');
    return response.data.categorias;
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    throw new Error('Error al obtener las categorías');
  }
};
