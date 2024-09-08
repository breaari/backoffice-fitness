import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { getCategorias } from '../Hooks/getCategorias';
import { useParams } from 'react-router-dom';
import { isValidName } from "../Validations/isValidName";
import { isValidId } from "../Validations/isValidId";
import { isValidDescripcion } from "../Validations/isValidDescripcion";
import { isValidVariantes } from "../Validations/isValidVariantes";
import { isValidPreciocompra } from "../Validations/isValidPreciocompra";
import { isValidPrecioventa } from "../Validations/isValidPrecioventa";
import { isValidStock } from "../Validations/isValidStock";
import { isValidImagen } from "../Validations/isValidImagen";
import { isValidGanancia } from "../Validations/isValidGanancia";
import { isValidPreciopromo } from "../Validations/isValidPreciopromo";
import { isValidCategoria } from "../Validations/isValidCategoria";
import { getSubcategorias } from '../Hooks/getSubcategorias';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const EditarProducto = () => {
    const { id } = useParams();

    const initialInput = {
        id: "",
        name: "",
        descripcion: "",
        variantes: [],
        preciocompra: "",
        precioventa: "",
        preciopromo: "",
        stock: {
            infinito: false,
            limitado: ""
        },
        imagen: [],
        categoriaId: "",
        subcategoriaId: ""
    };

    const initialErrors= {
        id: { valid: false, error: '' },          
        name: { valid: false, error: '' },
        ganancia: { valid: false, error: '' },
        descripcion: { valid: false, error: '' },
        preciocompra: { valid: false, error: '' },
        preciopromo: { valid: true, error: '' },
        stock: { valid: false, error: '' },
        //imagen: { valid: false, error: '' },
        categoria: { valid: false, error: '' },
    }

    const [input, setInput] = useState(initialInput);
    const [inputError, setInputError] = useState(initialErrors);
    const [subcategorias, setSubcategorias] = useState([]);
    const [images, setImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {

        const fetchProducto = async () => {
            try {
                const response = await axios.get(`/productos/${id}`);
                const producto = response.data.producto;

                if (producto.imagen === null) {
                    producto.imagen = ""; // Establecer imagen como cadena vacía
                }
        
                setInput(producto);
                // Convertir la cadena de imágenes en un array de URLs completas
                if (producto.imagen) {
                    const imageArray = producto.imagen.split(',').map(path => `https://back.paravosdistribuidora.com.ar/${path}`);
                    setImages(imageArray);
                }
            } catch (error) {
                console.error('Error al obtener el producto:', error);
            }
        };

        const fetchCategorias = async () => {
            try {
                const categoriasData = await getCategorias();
                setCategorias(categoriasData);
            } catch (error) {
                console.error('Error al obtener las categorías:', error);
            }
        };

        fetchProducto();
        fetchCategorias();
    }, [id]);

    useEffect(() => {
        const fetchSubcategorias = async () => {
          try {
            if (input.categoriaId) {
              const subcategoriasData = await getSubcategorias(input.categoriaId);
              setSubcategorias(subcategoriasData);
            }
          } catch (error) {
            console.error('Error al obtener las subcategorías:', error);
          }
        };
        fetchSubcategorias();
    }, [input.categoriaId]);

    useEffect(() => {
        if (input.imagen && typeof input.imagen === 'string') {
            const imageArray = input.imagen.split(',').map(path => `https://back.paravosdistribuidora.com.ar/${path}`);
            setImages(imageArray);
        }

        if (input.stock && typeof input.stock === 'string') {
            const stockObject = JSON.parse(input.stock);
            setInput((prevInput) => ({
                ...prevInput,
                stock: stockObject
            }));
        }

        if (input.variantes && typeof input.variantes === 'string') {
            setInput((prevInput) => ({
                ...prevInput,
                variantes: JSON.parse(input.variantes)
            }));
        }
    }, [input.imagen, input.stock], input.variantes);

    const handleColorChange = (selectedOptions) => {
        setInput((prevInput) => ({
            ...prevInput,
            variantes: selectedOptions
        }));
    };

    const handleChange = async (e) => {
        const { name, value, type, checked } = e.target;
    
        // Validaciones y actualizaciones de errores para cada campo
        if (name === 'id') {
            const { valid, error } = isValidId(value);
            setInputError((prevInputError) => ({
                ...prevInputError,
                id: { valid, error }
            }));
        } else if (name === 'name') {
            const { valid, error } = isValidName(value);
            setInputError((prevInputError) => ({
                ...prevInputError,
                name: { valid, error }
            }));
        } else if (name === 'descripcion') {
            const { valid, error } = isValidDescripcion(value);
            setInputError((prevInputError) => ({
                ...prevInputError,
                descripcion: { valid, error }
            }));
        } else if (name === 'preciocompra') {
            const { valid, error } = isValidPreciocompra(value);
            setInputError((prevInputError) => ({
                ...prevInputError,
                preciocompra: { valid, error }
            }));

        } else if (name === 'precioventa') {
            const { valid, error } = isValidPrecioventa(value, input.precioventa, input.preciocompra);
            setInputError((prevInputError) => ({
                ...prevInputError,
                precioventa: { valid, error }
            }));

        } else if (name === 'preciopromo') {
            const { valid, error } = isValidPreciopromo(value, input.precioventa, input.preciocompra);
            setInputError((prevInputError) => ({
                ...prevInputError,
                preciopromo: { valid, error }
            }));
        } else if (name === 'infinito') {
            // Manejo de cambios para el campo 'infinito' del stock
            setInput(prevInput => ({
                ...prevInput,
                stock: {
                    infinito: checked,
                    // Si infinito es verdadero, borra el valor de limitado
                    limitado: checked ? "" : prevInput.stock.limitado
                }
            }));
        } else if (name === 'limitado') {
            // Manejo de cambios para el campo 'limitado' del stock
            setInput(prevInput => ({
                ...prevInput,
                stock: {
                    ...prevInput.stock,
                    limitado: value
                }
            }));
        } else if (name === 'imagen') {
            // Validación y actualización de errores para el campo 'imagen'
            const { valid, error } = isValidImagen(value);
            setInputError((prevInputError) => ({
                ...prevInputError,
                imagen: { valid, error }
            }));
        } else if (name === 'categoriaId') {
            // Validación y actualización de errores para el campo 'categoriaId'
            const { valid, error } = isValidCategoria(value);
            setInputError((prevInputError) => ({
                ...prevInputError,
                categoriaId: { valid, error }
            }));
    
            // Obtener y establecer las subcategorías correspondientes
            try {
                const subcategoriasData = await getSubcategorias(value);
                setSubcategorias(subcategoriasData);
                // Establecer subcategoriaId en blanco
                setInput(prevInput => ({
                    ...prevInput,
                    subcategoriaId: "" 
                }));
            } catch (error) {
                console.error(`Error al obtener las subcategorías para la categoría ${value}:`, error);
            }
        } 
            // Para otros campos, actualiza directamente el estado
            setInput(prevInput => ({
                ...prevInput,
                [name]: value
            }));
        
    };

    const renderImageContainers = () => {
        const containers = [];
        const totalContainers = Math.max(4, images.length);
      
        for (let i = 0; i < totalContainers; i++) {
          containers.push(
            <div
              key={i}
              className="flex flex-col w-[23%] mq980:w-[47%] h-[150px] border-2 border-rojo shadow-md rounded-md justify-center items-center cursor-pointer overflow-hidden relative"
              
            >
              {images[i] && (
                <img
                 src={images[i]}
                  alt={`preview-${i}`}
                  className="object-cover w-full h-full"
                  onClick={() => handleImageClick(images[i])}
                />
              )}
              {!images[i] && (
                <>
                  <IoMdAddCircleOutline className="text-rojo text-[30px] " />
                  <h2 className="font-semibold text-sm mt-1">Agregar fotos</h2>
                  <input
                    type="file"
                    name="imagenes"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    // onChange={(e) => handleImageChange(e, i)}
                    onChange={handleImageChange}
                  />
                </>
              )}
              {/* Eliminar imagen si ya está presente */}
              {images[i] && (
                <button className="absolute top-2 right-2 text-sm text-white bg-red-500 px-2 py-1 rounded-md" onClick={() => handleRemoveImage(i)}>Eliminar</button>
              )}
            </div>
          );
        }
      
        return containers;
      };
      const handleRemoveImage = (index) => {
        // Eliminar la imagen de 'images' y 'newImages'
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
    
        const updatedNewImages = [...newImages];
        updatedNewImages.splice(index, 1);
        setNewImages(updatedNewImages);
    
        // Eliminar la imagen del campo 'imagen' si está presente
        if (input.imagen) {
            const currentImageUrls = input.imagen.split(',');
            const updatedImageUrls = [...currentImageUrls];
            updatedImageUrls.splice(index, 1);
            const updatedImagen = updatedImageUrls.join(',');
            setInput(prevInput => ({ ...prevInput, imagen: updatedImagen }));
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
    
        for (const key in input) {
            if (key === 'stock' || key === 'variantes' || key === 'subcategoria') {
                formData.append(key, JSON.stringify(input[key]));
            } else if (key !== 'imagen') {
                formData.append(key, input[key]);
            } else {
                formData.append(key, input[key]);
            }
        }
    
        // Agregar las imágenes nuevas al formData
        newImages.forEach((image) => {
            formData.append('imagenes', image);
        });
    
        const formDataObject = Object.fromEntries(formData.entries());

        try {
            const response = await axios.put(`/productos/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Producto actualizado exitosamente', {
                toastId: 'delete-success-toast',
            });
    
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            toast.error('Error al actualizar el producto.', {
                toastId: 'delete-error-toast',
            });
        }
    };

    const handleImageChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newImageFiles = Array.from(files);
            setNewImages(prevNewImages => [...prevNewImages, ...newImageFiles]);
            const newImageUrls = newImageFiles.map(file => URL.createObjectURL(file));
            setImages(prevImages => [...prevImages, ...newImageUrls]);
        }
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };
    
    const colorOptions = [
        { value: 'rojo', label: '🔴 Rojo' },
        { value: 'verde', label: '🟢 Verde' },
        { value: 'azul', label: '🔵 Azul' },
        { value: 'amarillo', label: '🟡 Amarillo' },
        { value: 'naranja', label: '🟠 Naranja' },
        { value: 'violeta', label: '🟣 Violeta' },
        { value: 'blanco', label: '⚪ Blanco' },
        { value: 'negro', label: '⚫ Negro' },
        { value: 'rosa', label: '🌸 Rosa' },
    ];

    return (
        <div className="w-[79%] mt-[74px] px-32 flex flex-col mq980:w-full mq980:px-6">
            <h1 className="font-bold text-2xl mb-2 mt-4">Editar producto</h1>
            <form onSubmit={handleSubmit}>
                <div className="border border-grismedio rounded-md p-4 shadow-md">
                    <h1 className="font-semibold text-lg mb-2">Nombre y descripción</h1>
                    <div className="flex flex-row items-center justify-between">
                        <h2 className="text-sm my-2">Nombre</h2>
                        <p className="text-rojo flex justify-center text-[14px]">{inputError.name.error}</p>
                        </div>
                            <label className="border-grismedio border rounded-md py-1">
                                <input className="text-sm focus:outline-none w-full px-2"
                                name="name"
                                value={input.name}   
                                onChange={handleChange}
                                >
                                </input>
                            </label>
                            <div className="flex flex-row items-center justify-between">
                                <h2 className="text-sm my-2">Descripción</h2>
                                <p className="text-rojo flex justify-center text-[14px]">{inputError.descripcion.error}</p>
                            </div>
                        
                            <label className="border-grismedio border rounded-md py-3 h-auto block">
                                <textarea className="text-sm focus:outline-none w-full px-2 h-24 resize-y overflow-hidden"
                                rows="1"
                                name="descripcion"
                                value={input.descripcion}   
                                onChange={handleChange}
                                >
                                </textarea>
                            </label>
                </div>
                <div className="border border-grismedio rounded-md p-4 shadow-md my-4">
                    <h1 className="font-semibold text-lg mb-2">Identificador</h1>
                    <div className="flex flex-row justify-between">
                            <div className="flex flex-row">
                            <h2 className="text-sm my-2 mr-4">Id</h2>
                                <label className="border-grismedio border rounded-md py-1 items-center flex w-[100px] px-1">#
                                    <input type="number" 
                                            min="24000"
                                            max=""
                                            step="1"
                                            className="text-sm focus:outline-none px-2 w-[80px]"
                                            name="id"
                                            value={input.id}   
                                            onChange={handleChange}>
                                    </input>
                                </label>
                                </div>
                                <p className="text-rojo flex justify-center text-[14px]">{inputError.id.error}</p>
                        </div>
                </div>
                <div className="border border-grismedio rounded-md p-4 my-4 shadow-md">
                    <h1 className="font-semibold text-lg mb-2">Fotos</h1>
                    <div className="flex flex-wrap justify-around gap-4">
                        {renderImageContainers()}
                        <input
                            id="fileInput"
                            type="file"
                            name="imagenes"
                            multiple
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>
                    {selectedImage && (
                        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center" onClick={closeModal}>
                            <div className="mt-20 p-4 rounded-md flex flex-row justify-center items-center w-[50%] h-[90%] overflow-hidden" onClick={e => e.stopPropagation()}>
                                <img 
                                src={selectedImage}
                                className="h-max-[80%] w-[50%] object-cover" />
                                <button className="absolute top-20 right-6 py-1 px-2 text-sm bg-rojo text-white rounded-md" onClick={closeModal}>Cerrar</button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="border border-grismedio rounded-md p-4 shadow-md">
                    <h1 className="font-semibold text-lg mb-2">Precio</h1>
                        <p className="text-rojo flex justify-center text-[14px]">{inputError.preciocompra.error}</p>
                        {/* <p className="text-rojo flex justify-center text-[14px]">{inputError.ganancia.error}</p> */}
                    
                    <div className="flex flex-row justify-between mq980:flex-col">
                        <div className="flex flex-col">
                                <h2 className="text-sm my-2">Precio de compra</h2>
                                <label className="border-grismedio border rounded-md px-2 py-1 text-sm mq980:w-[175px]">$
                                    <input className="text-sm focus:outline-none w-[100px] ml-1"
                                    type="number"
                                    min="1"
                                    max="1000000"
                                    step="0.01"
                                    name="preciocompra"
                                    value={input.preciocompra}   
                                    onChange={handleChange}>
                                    </input>ARS
                                </label>
                        </div>
                                <div  className="flex flex-col">
                                <h2 className="text-sm my-2">Precio de venta</h2>
                                <label className="border-grismedio border rounded-md px-2 py-1 text-sm mq980:w-[175px]">$
                                    <input className="text-sm focus:outline-none ml-1 w-[100px]"
                                            type="number"
                                            min="1"
                                            max="1000000"
                                            step="1"
                                            name="precioventa"
                                            value={input.precioventa} 
                                            onChange={handleChange}
                                            >
                                    </input>ARS
                                </label>
                                </div>
                                <div  className="flex flex-col">
                                    <h2 className="text-sm my-2">Precio promocional</h2>
                                        <label className="border-grismedio border rounded-md px-2 py-1 text-sm mq980:w-[175px]">$
                                            <input className="text-sm focus:outline-none ml-1 w-[100px]"
                                            type="number"
                                            min="1"
                                            max="1000000"
                                            step="1"
                                            name="preciopromo"
                                            value={input.preciopromo}   
                                            onChange={handleChange}>
                                            </input>ARS
                                        </label>
                                </div>
                            </div>
                </div>
                <div className="border border-grismedio rounded-md p-4 shadow-md my-4">
                    <h1 className="font-semibold text-lg mb-2">Stock</h1>
                    <p className="text-rojo flex justify-center text-[14px]">{inputError.stock.error}</p>
                        <div className="flex flex-row">
                            <input type="checkbox" 
                                    name="infinito"
                                    className="" 
                                    onChange={handleChange}
                                    checked={input.stock.infinito}>
                                    </input>
                            <h2 className="text-sm my-2 ml-2">Infinito</h2>
                        </div>
                        <h2 className="text-sm my-2">Limitado</h2>
                            <label className={`border-grismedio border rounded-md px-2 py-1 ${input.stock.infinito ? 'bg-gray-200 pointer-events-none' : ''}`}>
                                <input className="text-sm focus:outline-none"
                                        name="limitado"
                                        value={input.stock.infinito ? '' : input.stock.limitado}
                                        disabled={input.stock.infinito}
                                        type="number"
                                        min="0"
                                        max="1000000"
                                        step="1"
                                        onChange={handleChange}>
                                        </input>
                            </label>
                </div>
                <div className="border border-grismedio rounded-md p-4 shadow-md my-4">
                    <h1 className="font-semibold text-lg mb-2">Categorías y subcategorías</h1>
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-row">
                        <h2 className="text-sm my-2 mr-2">Categorías</h2>
                        <select
                            className=" rounded-md py-1 text-sm focus:outline-none px-2"
                            name="categoriaId"
                            value={input.categoriaId}
                            onChange={handleChange}
                        >
                            <option value="" disabled selected>Seleccionar</option>
                            {categorias.map(categoria => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nombre}
                                </option>
                            ))}
                        </select>
                        </div>
                          <p className="text-rojo flex justify-center text-[14px]">{inputError.categoria.error}</p>
                        </div>
                        <div className="flex flex-row">
                          <h2 className="text-sm my-2 mr-2">Subcategorías</h2>
                          <select
                            className="rounded-md py-1 text-sm focus:outline-none px-2"
                            name="subcategoriaId"
                            value={input.subcategoriaId}
                            onChange={handleChange}
                        >
                            <option value="">Seleccionar</option>
                            {subcategorias.map(subcategoria => (
                                <option key={subcategoria.id} value={subcategoria.id}>
                                    {subcategoria.nombre}
                                </option>
                            ))}
                        </select>
                        </div>  
                </div>
                <div className="border border-grismedio rounded-md p-4 shadow-md my-4">
                    <h1 className="font-semibold text-lg mb-2">Variantes</h1>
                    <div className="flex flex-row items-center">
                          <label className="text-sm mr-2">Colores:</label>
                            <Select
                                isMulti
                                value={input.variantes}
                                onChange={handleColorChange}
                                options={colorOptions} 
                            />
                        </div>
                </div>
                <div className="flex justify-end">
                    <button className="bg-rojo text-white rounded-md text-sm py-1 px-2 mb-6">Actualizar producto</button>
                </div>
            </form>
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
