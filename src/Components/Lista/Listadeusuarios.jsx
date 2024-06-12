import React, { useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SearchUsuarios } from "../NavBar/searchUsuarios";

export const Listadeusuarios = () => {

    const navigate = useNavigate()
    
    const goTo = (path) => {
        navigate(path);
    };

    const [usuarios, setUsuarios] = useState([]);
    const [query, setQuery] = useState('')
    const [tipo, setTipo] = useState('');

    console.log("tipo:", tipo)

    const fetchUsuarios = async (query = '', tipo = '') => {
        //setLoading(true);
        try {
            let url = `/usuarios`;
            if (query || tipo) {
                url = `/usuarios/search`;
            }
            const params = new URLSearchParams();
            if (query) params.append('q', query);
            if (tipo) params.append('tipo', tipo);
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await axios.get(url);
            console.log("response:", response.data);
            const usuario = response.data;
            console.log("usuario:", usuario);
          if (usuario.success) {
            const sortedUsuarios = usuario.usuarios.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setUsuarios(sortedUsuarios);
          } 
          //setLoading(false);
        } catch (error) {
            if (error.response.status === 404) {
                toast.error('No se encontraron usuarios que coincidan con la consulta.', {
                    toastId: 'delete-error-toast',
                });
            } if (error.response.status === 500) {
                toast.error('Error al obtener los usuarios', {
                    toastId: 'delete-error-toast',
                });
            }
          console.error('Error al obtener los usuarios:', error);
         
          //setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchUsuarios(); // Fetch all users on initial load
    }, []);

    useEffect(() => {
        fetchUsuarios( tipo); // Fetch users whenever query or tipo changes
    }, [ tipo]);

      const handleSearch = async (e) => {
        e.preventDefault();
        fetchUsuarios(query, tipo);
      };

      const handleResetFilter = () => {
        setTipo("");
      };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/usuarios/${id}`);
            setUsuarios((prevUsuarios) => prevUsuarios.filter(usuario => usuario.id !== id));
            toast.success('Usuario eliminado exitosamente', {
                toastId: 'delete-success-toast',
            });
        } catch (error) {
            toast.error('Error al eliminar el usuario. Por favor, inténtelo de nuevo más tarde.', {
                toastId: 'delete-error-toast',
            });
            console.error("Error al eliminar usuario:", error);
        }
    };


    return (
        <div className="w-[79%] mt-20 p-6"> 
            <div className="flex flex-row justify-between ">
                <h1 className="font-bold text-2xl">Usuarios</h1>
                <div className="flex flex-row bg-rojo text-white text-[14px] items-center font-semibold px-2 py-1 rounded-md">
                    <IoMdAddCircleOutline />
                    <button className="ml-1" onClick={() => goTo('/admin/listadeusuarios/crearusuarios')}>Crear usuario</button>
                </div>
            </div>
            <div>
                <SearchUsuarios query={query} setQuery={setQuery} handleSearch={handleSearch}  tipo={tipo} setTipo={setTipo} handleResetFilter={handleResetFilter}/>
            </div>
            <div>
                <table className="w-full bg-white text-left">
                        <thead className="">
                            <tr className="">
                                <th className="py-2 border-b border-gray-200 w-[25%]">Nombre</th>
                                <th className="py-2 border-b border-gray-200 w-[25%]">Email</th>
                                <th className="py-2 border-b border-gray-200 w-[25%]">Usuario</th>
                                <th className="py-2 border-b border-gray-200 w-[25%]">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td className="py-2 border-b border-gray-200  w-[25%]">{usuario.usuario}</td>
                                    <td className="py-2 border-b border-gray-200  w-[25%]">{usuario.email}</td>
                                    <td className="py-2 border-b border-gray-200  w-[25%]">{usuario.tipo}</td>
                                    <td className="py-2 border-b border-gray-200 w-[25%]">
                                        <button className="bg-grismedio text-white p-2 rounded mr-2" 
                                                onClick={() => goTo(`/admin/listadeusuarios/editarusuarios/${usuario.id}`)}>
                                        <FaRegEdit />
                                        </button>
                                        <button className="bg-rojo text-white p-2 rounded"
                                                onClick={() => handleDelete(usuario.id)}>
                                        <RiDeleteBin6Fill />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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