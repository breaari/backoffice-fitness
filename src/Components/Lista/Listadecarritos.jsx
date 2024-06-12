import { useEffect } from "react";
import { useState } from "react";
import axios from 'axios';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RiDeleteBin6Fill } from "react-icons/ri";
import { TiShoppingCart } from "react-icons/ti";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

export const Listadecarritos = () => {

    const [carritos, setCarritos] = useState([]);
    const [usuarios, setUsuarios] = useState({});
    const [detallesVisibles, setDetallesVisibles] = useState({});
    const [productos, setProductos] = useState({});

    console.log("productos:", productos)

    const eliminarCarritoHandler = async (carritoId) => {
        try {
            await axios.delete(`/carrito/${carritoId}`);
            setCarritos(carritos.filter(carrito => carrito.id !== carritoId));
            toast.success('Carrito eliminado exitosamente', {
                toastId: 'delete-success-toast',
            });
        } catch (error) {
            toast.error('Error al eliminar carrito', {
                toastId: 'not-found-toast',
            });
        }
    };

    

    useEffect(() => {
        const fetchCarritos = async () => {
            try {
                const response = await axios.get('/carrito');
                const carritos = response.data.carritos;

                const userRequests = carritos.map((carrito) => 
                    axios.get(`/usuarios/${carrito.userId}`)
                );

                const usersResponses = await Promise.all(userRequests);

                const usuariosMap = usersResponses.reduce((acc, response) => {
                    const user = response.data;
                    acc[user.id] = user;
                    return acc;
                }, {});

                setCarritos(carritos);
                setUsuarios(usuariosMap);
            } catch (error) {
                console.error("Error al obtener los carritos y usuarios:", error);
            }
        };

        fetchCarritos();
    }, []);

    const fetchProductDetails = async (productId) => {
        if (productos[productId]) {
            return productos[productId];
        }

        try {
            const response = await axios.get(`/productos/${productId}`);
            const product = response.data;
            setProductos((prevState) => ({
                ...prevState,
                [productId]: product,
            }));
            return product;
        } catch (error) {
            console.error(`Error al obtener los detalles del producto ${productId}:`, error);
        }
    };

    const toggleDetallesVisibles = async (carritoId) => {
        setDetallesVisibles((prevState) => ({
            ...prevState,
            [carritoId]: !prevState[carritoId]
        }));

        if (!detallesVisibles[carritoId]) {
            const carrito = carritos.find(c => c.id === carritoId);
            for (const producto of carrito.productos) {
                await fetchProductDetails(producto.productId);
            }
        }
    };
    
    return (
        <div className="w-[79%] mt-20">
        <div className="w-full h-full p-6">
            <h1 className="font-bold text-2xl">Carritos pendientes</h1>
            {carritos.length > 0 ? (
                <div className="mt-4">
                    {carritos.map((carrito) => (
                        <div key={carrito.id} className="border-t py-4 my-2 w-full">
                            <div className="flex flex-row items-center">
                                <TiShoppingCart className="text-4xl w-[10%]" />
                                <p className="w-[20%]"><strong>Productos: </strong>{carrito.productos.length}</p>
                                {usuarios[carrito.userId] && (
                                    <div className="flex flex-row justify-between w-[50%]">
                                        <p><strong>Usuario:</strong> {usuarios[carrito.userId].usuario}</p>
                                        <p><strong>Email:</strong> {usuarios[carrito.userId].email}</p>
                                    </div>
                                )}
                                <div className="flex flex-row justify-center w-[20%]">
                                    <button className="bg-rojo text-white p-1 rounded mr-4"
                                        onClick={() => eliminarCarritoHandler(carrito.id)}
                                    >
                                        <RiDeleteBin6Fill className="text-[18px]" />
                                    </button>
                                    <button className="bg-gray-400 text-white p-1 rounded"
                                        onClick={() => toggleDetallesVisibles(carrito.id)}
                                    >
                                        {detallesVisibles[carrito.id] ? (
                                            <IoIosArrowUp className="text-[18px]" />
                                        ) : (
                                            <IoIosArrowDown className="text-[18px]" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            {detallesVisibles[carrito.id] && (
                                <div className="mt-4">
                                    <h3 className="font-semibold ml-9">Detalle del carrito:</h3>
                                    {carrito.productos.map((item, index) => {
                                        const productId = item.productId;
                                        const cantidad = item.cantidad;
                                        const producto = productos[productId]?.producto; // Acceso al producto

                                            return (
                                                <div key={index} className="ml-8 mt-2">
                                                    {producto ? (
                                                        <div className="flex flex-row items-center">
                                                            <div className="w-[10%]">
                                                           </div>
                                                           <div className="w-[10%]"> 
                                                            <img 
                                                                src={`https://back.paravosdistribuidora.com.ar/${producto.imagen.split(',')[0]}`} 
                                                                alt={producto.name} 
                                                                className="w-16 h-16 object-cover shadow-md"
                                                            />
                                                            </div>
                                                            <p className="font- w-[20%]">{producto.name}</p>
                                                            <p className="w-[15%]"><strong>Cantidad:</strong> {cantidad}</p>
                                                        </div>
                                                    ) : (
                                                        <p>Cargando detalles del producto...</p>
                                                    )}
                                                </div>
                                            );
                                        })} 
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className='flex justify-center items-center h-[350px]'>
                    <box-icon name='loader-circle' animation='spin' color='#C41111' size="70px"></box-icon>
                </div>
            )}
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