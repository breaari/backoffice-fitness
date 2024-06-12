import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { isValidSubcategoriaNombre } from '../Validations/isValidSubcategoriaNombre';
import { isValidCategoriaSubcategoria } from '../Validations/isValidCategoriaSubcategoria';
import { getCategorias } from '../Hooks/getCategorias';

export const AgregarSubcategorias = () => {

        const initialInput = {
            nombre:"",
            categoriaId: ""
        }

        const [input, setInput ] = useState(initialInput);
    
        const initialErrors= {
          nombre: { valid: false, error: '' },
          categoriaId: { valid: false, error: ''}
        }
       
        const [inputError, setInputError ] = useState(initialErrors);

        const handleChange = async (e) => {
            const { name, value } = e.target;

            if (name === 'nombre') {
                const { valid, error } = await isValidSubcategoriaNombre(value);
                setInputError((prevInputError) => ({
                  ...prevInputError,
                  nombre: { valid, error }
                }));
              }

              if (name === 'categoriaId') {
                const { valid, error } = await isValidCategoriaSubcategoria(value);
                setInputError((prevInputError) => ({
                  ...prevInputError,
                  categoriaId: { valid, error }
                }));
              }
              
            setInput((prevInput) => ({
              ...prevInput,
              [name]: value
            }));
          };

          const [categorias, setCategorias] = useState([]);

          useEffect(() => {
            const fetchCategorias = async () => {
              try {
                const categorias = await getCategorias();
                setCategorias(categorias);
              } catch (error) {
                console.log("Error al cargar categorias:", error)
              } 
            };
        
            fetchCategorias();
          }, []);

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
              const responseBack = await axios.post("/subcategorias", input, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              toast.success('Subcategoría creada exitosamente', {
                toastId: 'delete-success-toast',
            });
              setInput(initialInput)
            } catch (error) {
              console.error('Error al crear subcategoría:', error);
              toast.error('Error al crear subcategoría, intente denuevo.', {
                toastId: 'delete-error-toast',
            });
            }
          };

    
    return (
        <div className="flex items-center w-[79%] h-full justify-center">
        <div className="flex flex-col items-start justify-center" >
        <h1 className="flex flex-col items-start font-bold text-2xl mb-2 mt-4">Nueva subcategoría</h1>
            <form className="" onSubmit={handleSubmit}>
                <div className="border border-grismedio rounded-md p-4 shadow-md w-[500px] mb-4">
                    <div className="flex flex-row items-center justify-between">
                        <h2 className="text-sm mb-2 ">Categoría a la que pertenece</h2>
                            <p className="text-rojo flex justify-center text-[14px]">{inputError.categoriaId.error}</p> 
                    </div>
                        <label className="border-grismedio border rounded-md py-1 flex items-center w-[205px]">
                            <select className='text-sm focus:outline-none w-[200px] px-2' 
                                    name="categoriaId"
                                    value={input.categoriaId}
                                    onChange={handleChange}>
                                <option disabled selected defaultValue value="">Seleccioná</option>
                                {categorias.map(categoria => (
                                <option value={categoria.id}>
                                  {categoria.nombre}
                                </option>
                                ))}
                            </select> 
                        </label> 
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
                    <button className="bg-rojo text-white rounded-md text-sm py-1 px-2 mb-6">
                        Crear subcategoria
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