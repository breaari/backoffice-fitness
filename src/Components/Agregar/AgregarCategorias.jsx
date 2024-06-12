import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import React, { useState } from 'react'
import { isValidCategoriaNombre } from '../Validations/isValidCategoriaNombre';
import axios from 'axios';

export const AgregarCategorias = () => {

        const initialInput = {
            nombre:"",
        }

        const [input, setInput ] = useState(initialInput);
    
        const initialErrors= {
          nombre: { valid: false, error: '' },
        }
       
        const [inputError, setInputError ] = useState(initialErrors);

        const handleChange = async (e) => {
            const { name, value } = e.target;

            if (name === 'nombre') {
                const { valid, error } = await isValidCategoriaNombre(value);
                setInputError((prevInputError) => ({
                  ...prevInputError,
                  nombre: { valid, error }
                }));
              }
              
            setInput((prevInput) => ({
              ...prevInput,
              [name]: value
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
              const responseBack = await axios.post("/categorias", input, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              toast.success('Categoría creada exitosamente', {
                toastId: 'delete-success-toast',
            });
              setInput(initialInput)
            } catch (error) {
              console.error('Error al crear categoría:', error);
              toast.error('Error al crear categoría, intente denuevo.', {
                toastId: 'delete-error-toast',
            });
            }
          };
    
    return (
        <div className="flex items-center w-[79%] h-full justify-center">
        <div className="mt-[74px] flex flex-col items-start justify-center" >
        <h1 className="flex flex-col items-start font-bold text-2xl mb-2 mt-4">Nueva categoría</h1>
            <form className="" onSubmit={handleSubmit}>
                <div className="border border-grismedio rounded-md p-4 shadow-md w-[500px] mb-4">
                        <div className="flex flex-row items-center justify-between">
                            <h2 className="text-sm my-2">Nombre</h2>
                            <p className="text-rojo flex justify-center text-[14px]">{inputError.nombre.error}</p> 
                        </div>
                            <label className="border-grismedio border rounded-md py-1">
                                <input 
                                    value={input.nombre}  
                                    onChange={handleChange}
                                    name="nombre"
                                    className="text-sm focus:outline-none w-full px-2">
                                </input>    
                            </label> 
                </div>
                <div className="flex flex-col justify-center items-end my-2">
                    <button className="bg-rojo text-white rounded-md text-sm py-1 px-2 mb-0">
                        Crear categoría
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