import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const EditarCategorias = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [categoria, setCategoria] = useState({
        nombre: "",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/categorias/${id}`);
                setCategoria(response.data.categoria);
            } catch (error) {
                setError("Error al obtener la categoria.");
                console.error("Error fetching category data:", error);
            }
        };
        fetchUserData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategoria((prevCategoria) => ({
            ...prevCategoria,
            [name]: value
        }));
    };

    const handleSaveChanges = async () => {
        try {
            await axios.put(`/categorias/${id}`, categoria, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            toast.success('Categoria actualizada exitosamente', {
                toastId: 'success-toast',
            });
            
            setTimeout(() => {
                navigate('/admin/categorias');
            }, 5000); 

        } catch (error) {
            toast.error('Error al actualizar la categoria.', {
                toastId: 'error-toast',
            });
            console.error("Error updating category data:", error);
        }
    };

    return (
        <div className="flex items-center w-[79%] h-full justify-center">
            <div className="mt-[74px] flex flex-col items-start justify-center">
                <h1 className="flex flex-col items-start font-bold text-2xl mb-2 mt-4">Editar categoria</h1>
                <div className="border border-grismedio rounded-md p-4 shadow-md w-[500px] mb-4">
                    <div className="flex flex-row items-center justify-between">
                        <h2 className="text-sm my-2">Nombre</h2>
                    </div>
                    <label className="border-grismedio border rounded-md py-1 flex flex-row justify-between">
                        <input
                            type="text"
                            name="nombre"
                            value={categoria.nombre}
                            onChange={handleChange}
                            className="text-sm px-2 w-full focus:outline-none"
                        />
                    </label>
                    
                </div>
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
    );
};