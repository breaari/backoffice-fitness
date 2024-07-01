import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Editarusuarios = () => {
    const { id } = useParams();
    const [usuario, setUsuario] = useState({
        usuario: "",
        email: "",
        tipo: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/usuarios/${id}`);
                setUsuario(response.data);
            } catch (error) {
                setError("Error al obtener los datos del usuario.");
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario((prevUsuario) => ({
            ...prevUsuario,
            [name]: value
        }));
    };

    const handleSaveChanges = async () => {
        try {
            await axios.put(`/usuarios/${id}`, usuario, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            toast.success('Usuario actualizado exitosamente', {
                toastId: 'success-toast',
            });
            setTimeout(() => {
                navigate('/admin/categorias');
            }, 5000); 
           
        } catch (error) {
            toast.error('Error al actualizar los datos del usuario.', {
                toastId: 'error-toast',
            });
            console.error("Error updating user data:", error);
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!usuario) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="flex items-center w-[79%] h-full justify-center mq980:w-full">
            <div className="mt-[74px] flex flex-col items-start justify-center">
                <h1 className="flex flex-col items-start font-bold text-2xl mb-2 mt-4">Editar usuario</h1>
                <div className="border border-grismedio rounded-md p-4 shadow-md w-[500px] mb-4  mq980:w-full">
                    <div className="flex flex-row items-center justify-between">
                        <h2 className="text-sm my-2">Nombre</h2>
                    </div>
                    <label className="border-grismedio border rounded-md py-1 flex flex-row justify-between">
                        <input
                            type="text"
                            name="usuario"
                            value={usuario.usuario}
                            onChange={handleChange}
                            className="text-sm px-2 w-full focus:outline-none"
                        />
                    </label>
                    <div className="flex flex-row items-center justify-between">
                        <h2 className="text-sm my-2">Email</h2>
                    </div>
                    <label className="border-grismedio border rounded-md py-1 flex flex-row justify-between">
                        <input
                            type="email"
                            name="email"
                            value={usuario.email}
                            onChange={handleChange}
                            className="text-sm px-2 w-full focus:outline-none"
                        />
                    </label>
                    <div className="flex flex-row items-center justify-between">
                        <h2 className="text-sm my-2">Tipo de rol</h2>
                    </div>
                    <label className="border-grismedio border rounded-md py-1 flex flex-row justify-between">
                        <select
                            name="tipo"
                            value={usuario.tipo}
                            onChange={handleChange}
                            className="text-sm px-2 w-full focus:outline-none"
                        >
                            <option value="administrador">Administrador</option>
                            <option value="usuario_comun">Usuario Común</option>
                        </select>
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

