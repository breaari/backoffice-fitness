import Logo from '../../assets/PV-1500PX.jpg'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineUser } from "react-icons/hi2";
import { AccesosMovil } from '../Accesos/AccesosMovil';

export const NavBar = () => {

    const navigate = useNavigate()
    
    // Función para navegar a una ruta específica
    const goTo = (path) => {
        navigate(path);
    };

    const [account, setAccount]= useState(false)

    const handleAccountClick = ()=> {
        if (account) {
            setAccount(false)
        } else {
            setAccount(true)
        }
    }

    const handleLogout = () => {
        // Eliminar los datos de usuario del localStorage
        localStorage.removeItem('user');
        // Actualizar el estado de isLogged
        goTo("/")
    };

    const [name, setName] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('usuario'));
        if (user && user.usuario) {
            setName(user.usuario);
        }
    }, []);

    return (
        <div className='fixed top-0 w-full z-50'>
            <div className='flex justify-between flex-row items-center px-6 py-3 bg-black'>
                <div className="hidden mq980:block">
                    <AccesosMovil></AccesosMovil>  
                </div>
                <div  className="overflow-hidden max-h-[50px] flex items-center cursor-pointer" onClick={() => goTo('/')}>
                    <img src={Logo} className=' h-[100px]'></img>
                </div>
                <div>
                    <h1 className='font-bold text-xl text-white mq980:hidden'>PANEL ADMINISTRADOR</h1>
                </div>
                <div className='flex flex-row items-center'>
                    <p className='text-white mr-2'>Hola, {name}!</p>
                    <HiOutlineUser className='text-[30px] text-white mr-6 mq980:mr-0 cursor-pointer' onClick={handleAccountClick}/>
                </div>
                { account && (
                  <div className='absolute right-20 top-20 mq980:right-5 z-30 bg-white p-6 shadow-md rounded-[2px] border-gray-200 border'>
                    <p onClick={handleLogout} className='bg-black hover:bg-rojo cursor-pointer text-white px-16 py-2 text-[14px] flex justify-center rounded-[2px]'>Cerrar sesión</p>
                  </div>  
                )}
            </div>
            
        </div>
    )
}