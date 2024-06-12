import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RiLockPasswordLine } from "react-icons/ri"
import { HiOutlineMail } from "react-icons/hi";
import { PiEyeClosedBold } from "react-icons/pi";
import { PiEyeBold } from "react-icons/pi";
import { isValidEmailLogin } from "../Validations/isValidEmailLogin";
import { isValidPassword } from "../Validations/isValidPassword";
import { startLoading, stopLoading } from "../../Redux/loadingSlice";

export const Login = () => {

    const [showPassword, setShowPassword] = useState(false)
    const handleShowPassword = () => {
        if (showPassword) {
            setShowPassword(false)
        } else {
            setShowPassword(true)
        }
    }

    const initialInput = {
        email: "",
        password: "",  
    }
        const [input, setInput ] = useState(initialInput);
    
        const initialErrors= {

          email: { valid: false, error: '' },
          password: { valid: false, error: '' },
    
      }
      const [inputError, setInputError ] = useState(initialErrors);
    
        const handleChange = async (e) => {
            const { name, value } = e.target;
        
              if (name === 'email') {
                const { valid, error } = await isValidEmailLogin(value);
                setInputError((prevInputError) => ({
                  ...prevInputError,
                  email: { valid, error }
                }));
              }
    
              if (name === 'password') {
                const { valid, error } = await isValidPassword(value);
                setInputError((prevInputError) => ({
                  ...prevInputError,
                  password: { valid, error }
                }));
              }
              
            setInput((prevInput) => ({
              ...prevInput,
              [name]: value
            }));
          };

        const isLoading = useSelector(state => state.loading.isLoading);
        const dispatch = useDispatch();

        const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = Object.values(inputError).every(field => field.valid);
      
        if (!isValid) {
          if (!toast.isActive('error-toast')) {
            toast.error('Parece que algunos campos están incompletos.', {
              toastId: 'error-toast', 
            });
          } 

        return
        } 
        try {

          dispatch(startLoading());
          const responseBack = await axios.post("/loginAdmin", input, {
            headers: {
              'Content-Type': 'application/json',
            },
      
          });
          console.log("responseBack:", responseBack.data)
          localStorage.setItem('usuario', JSON.stringify(responseBack.data.user));
          setTimeout(() => {
            dispatch(stopLoading());
          }, 5000);
          goTo('/admin'); 
        } catch (error) {
          toast.error('Email y/o contraseña incorrectos, intente denuevo.', {
            toastId: 'error-toast', 
          });
        } finally {
          dispatch(stopLoading());

        }
    };
     
     const navigate = useNavigate()
    
      const goTo = (path) => {
          navigate(path);
         
      };

    return (
        <div className="flex flex-col justify-center items-center w-full">
        <h1 className="absolute left-6 top-6 font-bold italic text-2xl">PANEL ADMINISTRADOR</h1>
        <form className="mt-36 mb-16 flex flex-col justify-center w-[400px]" onSubmit={handleSubmit}>
          {isLoading && <div className="overlay">Cargando...</div>}
            <h1 className="font-bold italic text-2xl flex justify-center ">INICIÁ SESIÓN</h1>
                <div className="flex justify-center m-2">
                    <label className="flex flex-row justify-between items-center w-[300px] border-b-2 border-black px-2">
                        <HiOutlineMail className="text-[30px] flex justify-center" />
                        <input placeholder="Email"
                                name="email"
                               value={input.email}   
                               onChange={handleChange}
                               className="px-4 py-2 flex justify-center text-xl w-[250px] focus:outline-none">
                        </input>    
                    </label> 
                </div>
                <div className="flex justify-center m-2">
                    <label className="flex flex-row justify-between items-center w-[300px] border-b-2 border-black px-2">
                        <RiLockPasswordLine className="text-[30px] flex justify-center" />
                        <input 
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={input.password}   
                            onChange={handleChange}
                            placeholder="Contraseña" 
                            className="px-4 py-2 flex justify-center text-xl w-[235px] focus:outline-none">
                        </input> 
                        <a onClick={handleShowPassword}>
                            {showPassword ? <PiEyeBold className="text-[20px]" /> : <PiEyeClosedBold className="text-[20px]" />}
                        </a> 
                    </label> 
                </div>
                <p className="flex justify-end mr-12 text-[14px] hover:underline my-2">Olvidé mi contraseña</p>
                <div className="flex justify-center my-2">
                <button className="bg-black text-white px-6 py-2 rounded-[2px] w-[200px] flex justify-center">
                    Iniciar sesión
                </button>
               
                </div>
                <div className="flex flex-col justify-center my-2">
                <p className="text-rojo flex justify-center text-[14px]">{inputError.email.error}</p>
                <p className="text-rojo flex justify-center text-[14px]">{inputError.password.error}</p>
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
                </form>
        </div>
    )
}