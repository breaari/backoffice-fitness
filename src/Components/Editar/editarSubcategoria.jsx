import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const EditarSubcategoria = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [subcategoria, setSubcategoria] = useState({
        nombre: "",
        categoriaId: ""
    });
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSubcategoriaData = async () => {
            try {
                const response = await axios.get(`/subcategorias/${id}`);
                setSubcategoria(response.data);
            } catch (error) {
                setError("Error al obtener la subcategoria.");
                console.error("Error fetching subcategory data:", error);
            }
        };
        fetchSubcategoriaData();
    }, [id]);

    useEffect(() => {
        const fetchCategoriasData = async () => {
            try {
                const response = await axios.get("/categorias");
                setCategorias(response.data.categorias); 
            } catch (error) {
                setError("Error al obtener las categorias.");
                console.error("Error fetching categories data:", error);
            }
        };
        fetchCategoriasData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubcategoria((prevSubcategoria) => ({
            ...prevSubcategoria,
            [name]: value
        }));
    };

    const handleSaveChanges = async () => {
        try {
            await axios.put(`/subcategorias/${id}`, subcategoria, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            toast.success('Subcategoria actualizada exitosamente', {
                toastId: 'success-toast',
            });
            setTimeout(() => {
                navigate('/admin/categorias');
            }, 5000); 

        } catch (error) {
            toast.error('Error al actualizar la subcategoria.', {
                toastId: 'error-toast',
            });
            console.error("Error updating subcategory data:", error);
        }
    };

    return (
        <div className="flex items-center w-[79%] h-full justify-center mt-[74px]">
            <div className="flex flex-col items-start justify-center">
                <h1 className="flex flex-col items-start font-bold text-2xl mb-2 mt-4">Editar subcategoría</h1>
                <div className="border border-grismedio rounded-md p-4 shadow-md w-[500px] mb-4">
                    <div className="flex flex-row items-center justify-between">
                        <h2 className="text-sm mb-2">Categoría a la que pertenece</h2>
                    </div>
                    <label className="border-grismedio border rounded-md py-1 flex items-center w-[205px]">
                        <select
                            className='text-sm focus:outline-none w-[200px] px-2'
                            name="categoriaId"
                            value={subcategoria.categoriaId}
                            onChange={handleChange}
                        >
                            <option disabled defaultValue value="">Seleccioná</option>
                            {categorias.map(categoria => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                    </label>
                    <div className="flex flex-row items-center justify-between">
                        <h2 className="text-sm my-2">Nombre</h2>
                    </div>
                    <label className="border-grismedio border rounded-md py-1">
                        <input
                            type="text"
                            name="nombre"
                            value={subcategoria.nombre}
                            onChange={handleChange}
                            className="text-sm focus:outline-none w-full px-2"
                        />
                    </label>
                </div>
                <div className="flex flex-col justify-center items-end my-2">
                    <button
                        onClick={handleSaveChanges}
                        className="bg-rojo text-white rounded-md text-sm py-1 px-2 mb-6"
                    >
                        Guardar cambios
                    </button>
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
        </div>
    );
};
