import React, { useState } from "react";
import { PiEyeClosedBold } from "react-icons/pi";
import { PiEyeBold } from "react-icons/pi";
import { ToastContainer, Zoom, toast } from 'react-toastify';
import { isValidEmail } from "../Validations/isValidEmail";
import { isValidPassword } from "../Validations/isValidPassword";
import { isValidPasswordConfirm } from "../Validations/isValidPasswordConfirm";
import { isValidUsuario } from "../Validations/isValidUsuario";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export const Crearusuarios = () => {

    const [showPassword, setShowPassword] = useState(false)
    const handleShowPassword = () => {
        if (showPassword) {
            setShowPassword(false)
        } else {
            setShowPassword(true)
        }
    }

    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
    const handleShowPasswordConfirm = () => {
        if (showPasswordConfirm) {
            setShowPasswordConfirm(false)
        } else {
            setShowPasswordConfirm(true)
        }
    }

    const initialInput = {
        usuario:"",
        email: "",
        password: "",  
        passwordConfirm: "",
        tipo: "usuario_comun"
    }
        const [input, setInput ] = useState(initialInput);
    console.log("input:", input)
        const initialErrors= {
          usuario: { valid: false, error: '' },
          email: { valid: false, error: '' },
          password: { valid: false, error: '' },
          passwordConfirm: { valid: false, error: '' }
    
      }
       
        const [inputError, setInputError ] = useState(initialErrors);

        const handleChange = async (e) => {
            const { name, value } = e.target;

            if (name === 'usuario') {
                const { valid, error } = await isValidUsuario(value);
                setInputError((prevInputError) => ({
                  ...prevInputError,
                  usuario: { valid, error }
                }));
              }
        
              if (name === 'email') {
                const { valid, error } = await isValidEmail(value);
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

              if (name === 'passwordConfirm') {
                const { valid, error } = await isValidPasswordConfirm(input.password, value);
                setInputError((prevInputError) => ({
                  ...prevInputError,
                  passwordConfirm: { valid, error }
                }));
              }
              
            setInput((prevInput) => ({
              ...prevInput,
              [name]: value
            }));
          };

          const handleCheckboxChange = (e) => {
            const { name, checked } = e.target;
            console.log("checked;", checked)
            setInput((prevState) => ({
              ...prevState,
              [name]: checked ? "administrador" : "usuario_comun"
            }));
          };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = Object.values(inputError).every(field => field.valid);
      
        if (!isValid) {
          if (!toast.isActive('error-toast')) {
            toast.error('Parece que algunos campos están incompletos.', {
              toastId: 'error-toast', 
            });
          }
          return;
        }
      
        try {
          const responseBack = await axios.post("/register", input, {
            headers: {
              'Content-Type': 'application/json',
            },
      
          });
          toast.success('Usuario creado exitosamente', {
            toastId: 'delete-success-toast',
        });
          setInput(initialInput)
        } catch (error) {
          toast.error('Error al crear usuario, intente denuevo.', {
            toastId: 'delete-error-toast',
        });
        }
      };

    return (
        <div className="flex items-center w-[79%] h-full justify-center">
        <div className="mt-[74px] flex flex-col items-start justify-center" >
        <h1 className="flex flex-col items-start font-bold text-2xl mb-2 mt-4">Nuevo usuario</h1>
            <form className="" onSubmit={handleSubmit}>
                <div className="border border-grismedio rounded-md p-4 shadow-md w-[500px] mb-4">
                        <div className="flex flex-row items-center justify-between">
                            <h2 className="text-sm my-2">Nombre</h2>
                            <p className="text-rojo flex justify-center text-[14px]">{inputError.usuario.error}</p>
                        </div>
                            <label className="border-grismedio border rounded-md py-1">
                                <input 
                                    value={input.usuario}  
                                    onChange={handleChange}
                                    name="usuario"
                                    className="text-sm focus:outline-none w-full px-2">
                                </input>    
                            </label> 
 
                        <div className="flex flex-row items-center justify-between">
                            <h2 className="text-sm my-2">Email</h2>
                            <p className="text-rojo flex justify-center text-[14px]">{inputError.email.error}</p>
                        </div>
                            <label className="border-grismedio border rounded-md py-1">
                                <input 
                                    value={input.email}  
                                    onChange={handleChange}
                                    name="email" 
                                    className="text-sm focus:outline-none w-full px-2">
                                </input>    
                            </label> 
               
                        <div className="flex flex-row items-center justify-between">
                            <h2 className="text-sm my-2">Contraseña</h2>
                            <p className="text-rojo flex justify-center text-[14px]">{inputError.password.error}</p>
                        </div>
                            <label className="border-grismedio border rounded-md py-1 flex flex-row justify-between">
                                <input
                                    value={input.password}  
                                    onChange={handleChange}
                                    name="password"
                                    type={showPassword ? 'text' : 'password'} 
                                    className="text-sm focus:outline-none px-2">
                                </input> 
                                <a onClick={handleShowPassword}>
                                        {showPassword ? <PiEyeBold className="text-[20px] mx-2" /> : <PiEyeClosedBold className="text-[20px] mx-2" />}
                                </a> 
                            </label> 
                        <div className="flex flex-row items-center justify-between">
                            <h2 className="text-sm my-2">Confirmar contraseña</h2>
                            <p className="text-rojo flex justify-center text-[14px] mb-2">{inputError.passwordConfirm.error}</p>
                        </div>
                <label className="border-grismedio border rounded-md py-1 flex flex-row justify-between">
                    <input
                        value={input.passwordConfirm}  
                        onChange={handleChange}
                        name="passwordConfirm" 
                        type={showPasswordConfirm ? 'text' : 'password'} 
                        className="text-sm focus:outline-none w-full px-2">
                    </input> 
                    <a onClick={handleShowPasswordConfirm}>
                        {showPasswordConfirm ? <PiEyeBold className="text-[20px] mx-2" /> : <PiEyeClosedBold className="text-[20px] mx-2" />}
                    </a> 
                </label> 

                <label className="flex text-sm py-4">El usuario es administrador?
                    <input className="ml-2" type="checkbox" name="tipo" checked={input.tipo === "administrador"} onChange={handleCheckboxChange} />
                </label>
            </div>
            <div className="flex flex-col justify-center items-end my-2">
            <button className="bg-rojo text-white rounded-md text-sm py-1 px-2 mb-6">
                Registrar
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
            </form>
            </div>      
    </div>
    )
}