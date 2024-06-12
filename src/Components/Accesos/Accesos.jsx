import React, { useState } from "react";
import { MdOutlineArticle } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { BiCategory } from "react-icons/bi";

export const Accesos = () => {

    const [visibleSections, setVisibleSections] = useState(new Set());

    const handleToggleSection = (section) => {
        const updatedSections = new Set(visibleSections);
        if (updatedSections.has(section)) {
            updatedSections.delete(section);
        } else {
            updatedSections.add(section);
        }
        setVisibleSections(updatedSections);
    };

    const navigate = useNavigate()
    
    // Función para navegar a una ruta específica
    const goTo = (path) => {
        navigate(path);
    };

    return (
     
        <div className="flex px-2 mt-[74px] w-[21%] bg-gray-100">
            <div className="p-6">
                <div>
                    <button className="font-semibold italic my-1"
                            onClick={() => handleToggleSection('productos')}>PRODUCTOS
                    </button>
                        { visibleSections.has('productos') && (
                            <div>
                                <div className="flex flex-row items-center ml-4 px-2 py-1 rounded-md hover:bg-gray-100">
                                    <MdOutlineArticle />
                                    <button className="italic ml-2" onClick={() => goTo('/admin/listadeproductos')}>Lista de productos</button>
                                </div>
                                <div className="flex flex-row items-center ml-4 px-2 py-1 rounded-md hover:bg-gray-100">
                                    <BiCategory />
                                    <button className="italic ml-2" onClick={() => goTo('/admin/categorias')}>Categorías</button>
                                </div>
                            </div>
                        )}
                </div>
                <div>
                    <button className="font-semibold italic my-1"
                        onClick={() => handleToggleSection('usuarios')}>USUARIOS
                    </button>
                        {visibleSections.has('usuarios') && (
                            <div className="flex flex-row items-center ml-4 px-2 py-1 rounded-md hover:bg-gray-100">
                                <MdOutlineArticle />
                                <button className="italic ml-2" onClick={() => goTo('/admin/listadeusuarios')}>Lista de usuarios</button>
                            </div>
                        )}
                </div>
                <div>
                    <button className="font-semibold italic my-1"
                        onClick={() => handleToggleSection('ventas')}>VENTAS
                    </button>
                        {visibleSections.has('ventas') && (
                            <div> 
                             <div className="flex flex-row items-center ml-4 px-2 py-1 rounded-md hover:bg-gray-100">
                             <MdOutlineArticle />
                             <button className="italic ml-2" onClick={() => goTo('/admin/listadepedidos')}>Lista de pedidos</button>
                            </div>
                            <div className="flex flex-row items-center ml-4 px-2 py-1 rounded-md hover:bg-gray-100">
                                <MdOutlineArticle />
                                <button className="italic ml-2" onClick={() => goTo('/admin/listadecarritos')}>Lista de carritos</button>
                            </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}