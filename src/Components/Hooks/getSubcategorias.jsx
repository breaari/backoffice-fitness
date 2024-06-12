import axios from 'axios';

export const getSubcategorias = async (categoriaId) => {

  try {
    const response = await axios.get('/subcategorias');
    const todasSubcategorias = response.data.subcategorias;
    const subcategoriasFiltradas = todasSubcategorias.filter(subcategoria => subcategoria.categoriaId === categoriaId);
    return subcategoriasFiltradas;
  } catch (error) {
    console.error(`Error al obtener las subcategorías para la categoría con ID ${categoriaId}:`, error);
    throw new Error('Error al obtener las subcategorías');
  }
};
