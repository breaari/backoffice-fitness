import React, { useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { RiDeleteBin6Fill } from "react-icons/ri";
import axios from 'axios';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SearchProductos } from "../NavBar/searchProductos";
import { getSubcategorias } from "../Hooks/getSubcategorias";
import { getCategorias } from "../Hooks/getCategorias";
import { ImportarExcel } from "./importarExcel";

export const Listadeproductos = () => {
    const [productos, setProductos] = useState([]);
    const [query, setQuery] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [selectedCategoria, setSelectedCategoria] = useState("");
    const [selectedSubcategoria, setSelectedSubcategoria] = useState("");
    const [selectedStock, setSelectedStock] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const navigate = useNavigate();

    const goTo = (path) => {
        navigate(path);
    };      

    useEffect(() => {
        const fetchData = async () => {
          const cate = await getCategorias();
          setCategorias(cate);
        };
      
        fetchData();
      }, []);

      useEffect(() => {
        const fetchSubcategorias = async () => {
          try {
            if (selectedCategoria) {
              const subcategoriasData = await getSubcategorias(selectedCategoria);
              setSubcategorias(subcategoriasData);
            }
          } catch (error) {
            console.error('Error al obtener las subcategorías:', error);
          }
        };
      
        fetchSubcategorias();
      }, [selectedCategoria]);

    
    const fetchProductos = async (query = '', categoria = '', subcategoria = '', stock = '') => {
        try {
            let url = '/productos/search';
            const params = new URLSearchParams();
    
            if (query) params.append('q', query);
            if (categoria) params.append('categoriaId', categoria);
            if (subcategoria) params.append('subcategoriaId', subcategoria);
            if (stock) params.append('stock', stock);
    
            if (params.toString()) {
                url += `?${params.toString()}`;
            } else {
                url = '/productos';
            }
    
            const response = await axios.get(url);
            if (response.data.success) {
                const productosData = response.data.productos;
                const productosWithStockJs = productosData.map(producto => {
                    // Verificar si stock es una cadena antes de intentar parsearla
                    let stockJs;
                    try {
                        stockJs = typeof producto.stock === 'string' ? JSON.parse(producto.stock) : producto.stock;
                    } catch (e) {
                        console.error('Error parsing stock JSON:', e);
                        stockJs = producto.stock; // Dejar el valor original si ocurre un error
                    }
                    return { ...producto, stock: stockJs };
                });
                const sortedProductos = productosWithStockJs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setProductos(sortedProductos);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error('No se encontraron productos que coincidan con la búsqueda', {
                    toastId: 'not-found-toast',
                });
                setSelectedCategoria("");
                setSelectedSubcategoria("");
                setSelectedStock("");
                setQuery("");
                setShowFilter(false);
            } else {
                console.error('Error al obtener los productos:', error);
            }
        }
    };
    
  
    useEffect(() => {
        fetchProductos();
      }, []);
    
    useEffect(() => {
        fetchProductos("", selectedCategoria, selectedSubcategoria, selectedStock);
      }, [ selectedCategoria, selectedSubcategoria, selectedStock]);
      
      const handleSearch = async (e) => {
        e.preventDefault();
        fetchProductos(query);
      };
    
    const handleChangeCategoria = async (e) => {
    setSelectedCategoria(e.target.value);
    
    try {
      const subcategoriasData = await getSubcategorias(value);
      setSubcategorias(subcategoriasData);
    } catch (error) {
      console.error('Error al obtener las subcategorías:', error);
    }
  };

  const handleChangeSubcategoria = (e) => {
    setSelectedSubcategoria(e.target.value);
  };

  const handleChangeStock = (e) => {
    setSelectedStock(e.target.value);
  };

  const handleResetFilter = () => {
    setSelectedCategoria("");
    setSelectedStock("");
    setSelectedSubcategoria("");
    setShowFilter(false)
  };

const toggleFilter = () => {
  
  if (showFilter) {
    setShowFilter(false)
  } else {
    setShowFilter(true)
  }
};

    const handleStockChange = async (productId, newStock) => {
        try {
            await updateProducto(productId, { stock: newStock });
        } catch (error) {
            console.error('Error al actualizar el stock del producto:', error);
        }
    };
  

    // Función para manejar el cambio en el precio de compra
const handlePrecioCompraChange = async (productId, newPrecioCompra) => {
    try {
        // Actualizar solo el campo de precio de compra
        await updateProducto(productId, {
            preciocompra: newPrecioCompra,
        });
    } catch (error) {
        console.error('Error al actualizar el precio de compra del producto:', error);
    }
};

// Función para manejar el cambio en el precio de venta
const handlePrecioVentaChange = async (productId, newPrecioVenta) => {
    try {
        // Actualizar solo el campo de precio de venta
        await updateProducto(productId, { 
            precioventa: newPrecioVenta
        });
    } catch (error) {
        console.error('Error al actualizar el precio de venta del producto:', error);
    }
};

// Función para manejar el cambio en el precio promocional
const handlePrecioPromoChange = async (productId, newPrecioPromo) => {
    try {
        const updatedProduct = productos.find(producto => producto.id === productId);

        if (updatedProduct) {
            // Determinar el valor correcto de preciopromo
            const preciopromoValue = newPrecioPromo ? parseFloat(newPrecioPromo) : null;

            // Actualizar optimistamente el precio promocional en la UI
            const updatedProductos = productos.map(producto =>
                producto.id === productId ? { ...producto, preciopromo: preciopromoValue } : producto
            );
            setProductos(updatedProductos);

            // Enviar la solicitud para actualizar el producto en el backend
            await updateProducto(productId, { preciopromo: preciopromoValue });
        }
    } catch (error) {
        console.error('Error al actualizar el precio promocional del producto:', error);
    }
};

// Función para actualizar un producto
const updateProducto = async (productId, newData) => {
    try {
        const currentProduct = productos.find(producto => producto.id === productId);
        if (!currentProduct) {
            throw new Error('Producto no encontrado');
        }

        // Crear un objeto con solo los campos que han cambiado
        const updatedData = {
            ...currentProduct,
            ...newData,
            stock: typeof newData.stock === 'object' ? JSON.stringify(newData.stock) : currentProduct.stock,
            precioventa: newData.precioventa !== undefined ? (isNaN(parseFloat(newData.precioventa)) ? currentProduct.precioventa : parseFloat(newData.precioventa)) : currentProduct.precioventa,
            preciocompra: newData.preciocompra !== undefined ? (isNaN(parseFloat(newData.preciocompra)) ? currentProduct.preciocompra : parseFloat(newData.preciocompra)) : currentProduct.preciocompra,
            preciopromo: newData.preciopromo !== undefined ? (isNaN(parseFloat(newData.preciopromo)) ? null : parseFloat(newData.preciopromo)) : currentProduct.preciopromo
        };

        await axios.put(`/productos/${productId}`, updatedData);

        const updatedProductos = productos.map(producto =>
            producto.id === productId ? updatedData : producto
        );
        setProductos(updatedProductos);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
    }
};
    
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/productos/${id}`);
            setProductos((prevProductos) => prevProductos.filter(producto => producto.id !== id));
            toast.success('Producto eliminado exitosamente', {
                toastId: 'delete-success-toast',
            });
        } catch (error) {
            toast.error('Error al eliminar el producto. Por favor, inténtelo de nuevo más tarde.', {
                toastId: 'delete-error-toast',
            });
            console.error("Error al eliminar el producto:", error);
        }
    };

    return (
        <div className="w-[79%] mq980:w-full mt-20"> 
            <div className="w-full h-full p-6">
                <div className="flex flex-row bg-white justify-between">
                    <h1 className="font-bold text-2xl">Productos</h1>
                    <div className="flex flex-row bg-rojo text-white text-[14px] items-center font-semibold px-2 py-1 rounded-md">
                        <IoMdAddCircleOutline />
                        <button className="ml-1" onClick={() => goTo('/admin/listadeproductos/agregarproductos')}>Agregar producto</button>
                    </div>
                </div>
                <div>
                        <ImportarExcel></ImportarExcel>
                </div>
                <div>
                   <SearchProductos  query={query}
                                    setQuery={setQuery}
                                    handleSearch={handleSearch}
                                    categorias={categorias}
                                    selectedCategoria= {selectedCategoria} 
                                    subcategorias={subcategorias}
                                    selectedSubcategoria={selectedSubcategoria}
                                    selectedStock={selectedStock}
                                    handleChangeCategoria={handleChangeCategoria}
                                    handleChangeSubcategoria={handleChangeSubcategoria}
                                    handleChangeStock={handleChangeStock}
                                    toggleFilter={toggleFilter}
                                    showFilter={showFilter}
                                    handleResetFilter={handleResetFilter}
                    /> 
                </div>
                <div className="mq980:hidden flex flex-row justify-start font-bold text-lg px-4">
                    <div className="w-[35%] border-b border-gray-200 py-2">Producto</div>
                    <div className="w-[15%] border-b border-gray-200 py-2">Stock</div>
                    <div className="w-[15%] border-b border-gray-200 py-2">Compra</div>
                    <div className="w-[15%] border-b border-gray-200 py-2">Venta</div>
                    <div className="w-[15%] border-b border-gray-200 py-2">Promocional</div>
                    <div className="w-[5%] border-b border-gray-200 py-2"></div>
                </div>
              
            <div className="mt-4">
    {productos.map(producto => (
            <div>
                <div className="hidden mq980:block flex-row p-4 my-4 rounded-sm py-2 border-b border-gray-200 bg-white w-full">
                <div className="flex flex-row justify-start h-full w-full">
                    <div className="flex flex-row w-full mb-2">
                        <div className="w-[25%]">
                        <img 
                            src={producto.imagen ? `https://back.paravosdistribuidora.com.ar/${producto.imagen.split(',')[0]}` : ''} 
                            alt={producto.name} 
                            className="w-16 h-16 object-cover"
                        />
                       </div> 
                        <div className="w-[75%]">
                        <Link to={`/admin/listadeproductos/editarproducto/${producto.id}`} className="flex-1">
                            <h3 className=" font-semibold px-2 truncate max-w-[250px]">{producto.name}</h3>
                        </Link>
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-col px-2">
                                <a className="text-sm font-semibold text-gray-500">Stock</a>
                                <label className={`${producto.stock.limitado === "0" || producto.stock.limitado === 0 ? 'border-rojo' : ''}  border-grismedio border rounded-md p-1 flex items-center text-sm w-[60px]`}>
                                    <input 
                                        min={0}
                                        max={10000000}
                                        type="number" 
                                        value={producto.stock.infinito ? '' : producto.stock.limitado}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            let newStock = {};

                                            if (inputValue === '') {
                                                newStock = { infinito: true, limitado: '' };
                                            } else {
                                                newStock = { infinito: false, limitado: inputValue };
                                            }

                                            handleStockChange(producto.id, newStock);
                                        }} 
                                        className={`${producto.stock.limitado === "0" || producto.stock.limitado === 0 ? 'text-rojo' : ''} text-sm px-2 w-[50px] focus:outline-none no-spinners`}
                                    />
                                </label>
                            </div> 
                            <div className="flex flex-col px-2">
                                <a className="text-sm font-semibold text-gray-500">Precio compra</a>
                                <label className="border-grismedio border rounded-md p-1 flex items-center text-sm w-[100px]">$
                                    <input 
                                        min={0}
                                        max={10000000}
                                        type="number" 
                                        value={producto.preciocompra} 
                                        onChange={(e) => handlePrecioCompraChange(producto.id, e.target.value)}
                                        className="text-sm px-2 w-[80px] focus:outline-none" 
                                    />
                                </label>
                            </div>
                            <div className="flex items-end">
                                <button className="bg-rojo text-white p-1 rounded"
                                    onClick={() => handleDelete(producto.id)}
                                >
                                    <RiDeleteBin6Fill className="text-[18px]"/>
                                </button>
                            </div> 
                        </div>
                        </div>
                    </div>
                        
                    </div>
                </div>

            <div key={producto.id} className="mq980:hidden flex flex-row p-4 my-4 rounded-md py-2 border-b border-gray-200 bg-white w-full">
                <div className="flex flex-row justify-start h-full w-full">
                    <div className="flex flex-row w-[35%] mb-2">
                        <img 
                            src={producto.imagen ? `https://back.paravosdistribuidora.com.ar/${producto.imagen.split(',')[0]}` : ''} 
                            alt={producto.name} 
                            className="w-16 h-16 object-cover"
                        />
                        <Link to={`/admin/listadeproductos/editarproducto/${producto.id}`}>
                            <h3 className="text-lg font-semibold px-2 ">{producto.name}</h3>
                        </Link>
                    </div>
                    <div className="w-[15%]">
                        <label className={`${producto.stock.limitado === "0" || producto.stock.limitado === 0 ? 'border-rojo' : ''}  border-grismedio border rounded-md p-1 flex items-center text-sm w-[100px]`}>
                            <input 
                                min={0}
                                max={10000000}
                                type="number" 
                                value={producto.stock.infinito ? '' : producto.stock.limitado}
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    let newStock = {};

                                    if (inputValue === '') {
                                        newStock = { infinito: true, limitado: '' };
                                    } else {
                                        newStock = { infinito: false, limitado: inputValue };
                                    }

                                    handleStockChange(producto.id, newStock);
                                }} 
                                className={`${producto.stock.limitado === "0" || producto.stock.limitado === 0 ? 'text-rojo' : ''} text-sm px-2 w-[80px] focus:outline-none no-spinners`}
                            />
                        </label>
                    </div>
                    <div className="w-[15%]">
                        <label className="border-grismedio border rounded-md p-1 flex items-center text-sm w-[100px]">$
                            <input 
                                min={0}
                                max={10000000}
                                type="number" 
                                value={producto.preciocompra} 
                                onChange={(e) => handlePrecioCompraChange(producto.id, e.target.value)}
                                className="text-sm px-2 w-[80px] focus:outline-none" 
                            />
                        </label>
                    </div>
                    <div className="w-[15%]">
                        <label className="border-grismedio border rounded-md p-1 flex items-center text-sm w-[100px]">$
                            <input
                                min={0}
                                max={10000000} 
                                type="number" 
                                value={producto.precioventa} 
                                className="text-sm px-2 w-[80px] focus:outline-none" 
                                onChange={(e) => handlePrecioVentaChange(producto.id, e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="w-[15%]">
                        <label className="border-grismedio border rounded-md p-1 flex items-center text-sm w-[100px]">
                            <input 
                                min={0}
                                max={10000000}
                                type="number" 
                                value={producto.preciopromo === '' ? '' : parseFloat(producto.preciopromo)} 
                                onChange={(e) => handlePrecioPromoChange(producto.id, e.target.value)}
                                className="text-sm px-2 w-[80px] focus:outline-none" 
                            />
                        </label>
                    </div>
                    <div className="w-[5%]">
                        <button className="bg-rojo text-white p-1 rounded"
                            onClick={() => handleDelete(producto.id)}
                        >
                            <RiDeleteBin6Fill className="text-[18px]"/>
                        </button>
                    </div>
                </div>
            </div>
            </div>
    ))}
</div>
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
