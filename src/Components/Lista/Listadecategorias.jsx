import React, { useEffect,useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { getCategorias } from "../Hooks/getCategorias";
import { RxDragHandleDots2 } from "react-icons/rx";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import axios from "axios";
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Listadecategorias = () => {

    const navigate = useNavigate()
    
    const goTo = (path) => {
        navigate(path);
    };

  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [visibleSections, setVisibleSections] = useState({}); 
 

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const categoriasData = await getCategorias();
        setCategorias(categoriasData);
        const allSubcategorias = await axios.get('/subcategorias');

        setSubcategorias(allSubcategorias.data.subcategorias);
        const initialVisibleState = {};

        categoriasData.forEach(categoria => {
          initialVisibleState[categoria.id] = false;
        });
        setVisibleSections(initialVisibleState);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  const subcategoriasHandle = (categoriaId) => {

    const subcategoriasFiltradas = subcategorias.filter(subcategoria => subcategoria.categoriaId === categoriaId);
    const subcategoria = subcategoriasFiltradas.map(subcategoria => subcategoria);

    return subcategoria;
  };

  const handleCategoryClick = async (categoriaId) => {

    const updatedSections = { ...visibleSections };
    updatedSections[categoriaId] = !updatedSections[categoriaId];

    setVisibleSections(updatedSections);
  };

  const handleDelete = async (id) => {
    try {
        await axios.delete(`/categorias/${id}`);
        setCategorias((prevCategorias) => prevCategorias.filter(categoria => categoria.id !== id));
        toast.success('Categoría eliminada exitosamente', {
            toastId: 'delete-success-toast',
        });
    } catch (error) {
        toast.error('Error al eliminar la categoría. Por favor, inténtelo de nuevo más tarde.', {
            toastId: 'delete-error-toast',
        });
        console.error("Error al eliminar la categoría:", error);
    }
};

const handleDeleteSubcategoria = async (id) => {
  try {
      await axios.delete(`/subcategorias/${id}`);
      setSubcategorias((prevSubcategorias) => prevSubcategorias.filter(subcategoria => subcategoria.id !== id));
      toast.success('Subcategoría eliminada exitosamente', {
          toastId: 'delete-success-toast',
      });
  } catch (error) {
      toast.error('Error al eliminar la subcategoría. Por favor, inténtelo de nuevo más tarde.', {
          toastId: 'delete-error-toast',
      });
      console.error("Error al eliminar la subcategoría:", error);
  }
};

    return (
        <div className="w-[79%] mt-20"> 
            <div className=" w-full h-full p-6 flex flex-col">
                <div className="flex flex-row bg-white justify-between">
                    <h1 className="font-bold text-2xl">Categorias</h1>
                        <div className="flex flex-row bg-rojo text-white text-[14px] items-center font-semibold px-2 py-1 rounded-md">
                            <IoMdAddCircleOutline />
                            <button className="ml-1" onClick={() => goTo('/admin/categorias/agregarcategorias')}>Agregar categorias</button>
                        </div>
                </div>
                <div className="mt-8">
                {categorias.map((categoria) => (
                        <div key={categoria.id} className="mb-2">
                          
                            <div className="flex flex-row justify-between items-center cursor-pointer p-2 border border-grismedio shadow-md rounded-md font-bold text-xl" onClick={() => handleCategoryClick(categoria.id)}>
                                <div className="flex flex-row items-center">
                                <RxDragHandleDots2 className="mr-1"/>
                                {categoria.nombre}
                                </div>
                                <div>
                              <button className="bg-grismedio text-white p-1 rounded mr-2" 
                                  onClick={() => goTo(`/admin/categorias/editarcategoria/${categoria.id}`)}>
                                  <FaRegEdit className="text-[18px]" />
                              </button>
                              <button className="bg-rojo text-white p-1 rounded"
                                  onClick={() => handleDelete(categoria.id)}>
                                  <RiDeleteBin6Fill className="text-[18px]"/>
                              </button>
                            </div>
                            
                            </div>
                            {visibleSections[categoria.id] && (
                <div className="ml-8 mt-2">
                 {subcategoriasHandle(categoria.id).length > 0 ? (
                    subcategoriasHandle(categoria.id).map((nombreSubcategoria, index) => (
                      <div
                        key={index}
                        className="flex flex-row justify-between items-center cursor-pointer p-2 border border-grismedio shadow-md rounded-md font-bold text-lg my-2"
                      >
                       <div className="flex flex-row items-center"> 
                        <RxDragHandleDots2 className="mr-1" />
                        {nombreSubcategoria.nombre}
                        </div>
                        <div>
                              <button className="bg-grismedio text-white p-1 rounded mr-2" 
                                  onClick={() => goTo(`/admin/categorias/editarsubcategoria/${nombreSubcategoria.id}`)}>
                                  <FaRegEdit className="text-[18px]" />
                              </button>
                              <button className="bg-rojo text-white p-1 rounded"
                                  onClick={() => handleDeleteSubcategoria(nombreSubcategoria.id)}>
                                  <RiDeleteBin6Fill className="text-[18px]"/>
                              </button>
                            </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 font-semibold text-lg rounded-md">No hay subcategorías</div>
                  )}
                </div>  
              )}
              </div>
                    ))}
                </div> 
            </div> 
            <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  limit={1}
                  queue={false}
                  theme="colored"
                  transition={Zoom}
                />
        </div>
    )
}