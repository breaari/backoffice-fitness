import React, { useState } from "react";
import { MdOutlineArticle } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { BiCategory } from "react-icons/bi";
import { IoMenu } from "react-icons/io5";

export const AccesosMovil = () => {

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
    
    const goTo = (path) => {
        navigate(path);
        setAccesosOpen(false)
    };

    const [accesosOpen, setAccesosOpen] = useState(false)

    const toggleAccesosOpen = () => {
        setAccesosOpen(!accesosOpen)
    }

    return (
     
        <div className="">
            <div>
                <IoMenu className="text-[30px] text-white" onClick={toggleAccesosOpen}/>
            </div>
            { accesosOpen && (
            <div className="absolute top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-50 flex flex-col">
                <div className="bg-black rounded-sm shadow-md w-[60%] min-h-screen p-6">
                <div>
                    <IoMenu className="text-[30px] text-white mb-6" onClick={toggleAccesosOpen}/>
                </div>
                <div className="text-white">
                    <button className="font-semibold italic my-1"
                            onClick={() => handleToggleSection('productos')}>PRODUCTOS
                    </button>
                        { visibleSections.has('productos') && (
                            <div>
                                <div className="flex flex-row items-center ml-4 px-2 py-1 rounded-md">
                                    <MdOutlineArticle />
                                    <button className="italic ml-2" onClick={() => goTo('/admin/listadeproductos')}>Lista productos</button>
                                </div>
                                <div className="flex flex-row items-center ml-4 px-2 py-1 rounded-md">
                                    <BiCategory />
                                    <button className="italic ml-2" onClick={() => goTo('/admin/categorias')}>Categorías</button>
                                </div>
                            </div>
                        )}
                </div>
                <div className="text-white">
                    <button className="font-semibold italic my-1"
                        onClick={() => handleToggleSection('usuarios')}>USUARIOS
                    </button>
                        {visibleSections.has('usuarios') && (
                            <div className="flex flex-row items-center ml-4 px-2 py-1 rounded-md">
                                <MdOutlineArticle />
                                <button className="italic ml-2" onClick={() => goTo('/admin/listadeusuarios')}>Lista de usuarios</button>
                            </div>
                        )}
                </div>
                <div className="text-white">
                    <button className="font-semibold italic my-1"
                        onClick={() => handleToggleSection('ventas')}>VENTAS
                    </button>
                        {visibleSections.has('ventas') && (
                            <div> 
                             <div className="flex flex-row items-center ml-4 px-2 py-1 rounded-md ">
                             <MdOutlineArticle />
                             <button className="italic ml-2" onClick={() => goTo('/admin/listadepedidos')}>Lista de pedidos</button>
                            </div>
                            <div className="flex flex-row items-center ml-4 px-2 py-1 rounded-md">
                                <MdOutlineArticle />
                                <button className="italic ml-2" onClick={() => goTo('/admin/listadecarritos')}>Lista de carritos</button>
                            </div>
                            </div>
                        )}
                </div>
                </div>
            </div>
            )}
        </div>
    )
}