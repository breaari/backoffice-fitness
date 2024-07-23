import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export const VerPedido = () => {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [productosDetalles, setProductosDetalles] = useState([]);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchPedido = async () => {
        try {
            const response = await axios.get(`/pedido/${id}`);
            const pedidoData = response.data.pedido;
            setPedido(pedidoData);

            // Obtener detalles de los productos
            const productosData = await Promise.all(
                pedidoData.pedido.map(async (producto) => {
                    try {
                        const productoResponse = await axios.get(`/productos/${producto.productId}`);
                        return { ...productoResponse.data, cantidad: producto.cantidad };
                    } catch (error) {
                        if (error.response && error.response.status === 404) {
                            return { id: producto.productId, nombre: "No encontrado", cantidad: producto.cantidad };
                        } else {
                            throw error; // Lanza otros errores para ser capturados en el bloque de catch exterior
                        }
                    }
                })
            );

            setProductosDetalles(productosData);

            // Obtener detalles del usuario
            try {
                const usuarioResponse = await axios.get(`/usuarios/${pedidoData.userId}`);
                setUsuario(usuarioResponse.data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setUsuario({ nombre: "No encontrado" });
                } else {
                    throw error; // Lanza otros errores para ser capturados en el bloque de catch exterior
                }
            }
        } catch (error) {
            console.error("Error fetching pedido:", error);
        }
    };

    fetchPedido();
}, [id]);



  if (!pedido || !usuario) {
    return (
        <div className='flex w-[79%] mq980:w-full h-screen justify-center items-center'>
            <box-icon name='loader-circle' animation='spin' color='#C41111' size="70px"></box-icon>
        </div>
    )
  }

//   const detallesEnvio = () => {
//     if (pedido.metodo_envio === "envio gratis") {
//       return (
//         <>
//           <p><strong>Indicaciones de entrega:</strong> {pedido.indicaciones_entrega || 'N/A'}</p>
//           <p><strong>Tipo de dirección:</strong> {pedido.tipo_direccion || 'N/A'}</p>
//         </>
//       );
//     } else if (pedido.metodo_envio === "por correo") {
//       return (
//         <>
//           <p><strong>Sucursal o domicilio:</strong> {pedido.sucursal_o_domicilio}</p>
//           <p><strong>Empresa de transporte:</strong> {pedido.empresa_transporte}</p>
//           <p><strong>Link de seguimiento:</strong> {pedido.link_seguimiento || 'N/A'}</p>
//         </>
//       );
//     } else {
//       return null; // Manejar otros métodos de envío según sea necesario
//     }
//   };

  const calcularDescuento = (precioventa, preciopromo) => {
    if (isNaN(preciopromo) || preciopromo === null || preciopromo >= precioventa) {
        return null;
    }
    const descuento = ((precioventa - preciopromo) / precioventa) * 100;
    return Math.round(descuento);
};

const calcularSubtotal = (precio, cantidad) => {
    return (precio * cantidad).toFixed(2);
};

console.log("productosdetalles 111:", productosDetalles)
  return (
    <div className="w-[79%] mt-20 mq980:w-full">
      <div className="w-full h-full p-12 bg-white flex flex-col">
        <div className="flex flex-row justify-around mq980:flex-col">
            <div className="border shadow-md rounded-sm p-4 mq980:mb-2">
                <h1 className="font-bold text-2xl mb-4">Detalles del pedido</h1>
                    <div className=" flex flex-col">
                        <div className="flex flex-row">
                            <p className="mr-2"><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleDateString()}</p>
                            <p><strong>Hora:</strong> {pedido.hora}</p>
                        </div>
                        <p><strong>Estado:</strong> {pedido.estado}</p>
                        <div className="flex flex-col">
                            {/* <p><strong>Dirección de entrega:</strong> {pedido.direccion_entrega}</p>
                            <p><strong>Método de envío:</strong> {pedido.metodo_envio}</p> */}
                            {/* {detallesEnvio()} */}
                            <p><strong>Total:</strong> ${pedido.total}</p>
                        </div>
                    </div>
            </div>
                <div className="flex flex-col border shadow-md rounded-sm p-4">
                    <h1 className="font-bold text-2xl mb-4">Información del usuario</h1>
                    <p><strong>Usuario:</strong> {usuario.usuario}</p>
                    {/* <p><strong>Número de contacto:</strong> {pedido.numero_contacto}</p> */}
                    <p><strong>Email:</strong> {usuario.email}</p>
                </div>
             
        </div>
        <div className="flex flex-col border shadow-md rounded-sm p-4 mt-12">
            <h1 className="font-bold text-2xl mb-4">Pedido</h1>
            <div className=" flex flex-row w-[100%] font-bold py-4 border-b px-2 mq980:px-0 ">
                <div className="flex flex-row w-[30%] mq980:hidden">
                    <div className="w-[30%]"></div>
                    <div className="w-[70%]">Nombre</div>
                </div>  
                <div className="w-[70%] flex flex-row mq980:w-full mq980:justify-between">
                    <div className="w-[40%] mq980:w-[30%]">Valor</div>
                    <div className="w-[30%]">Cantidad</div>
                    <div className="w-[30%]">Subtotal</div>
                </div>
            </div>

<div className="flex flex-col w-full p-2">
    {pedido.pedido.map((productoPedido, index) => {
        const productoDetalle = productosDetalles[index];
        const producto = productoDetalle.producto || productoDetalle;
        const descuento = calcularDescuento(productoPedido.precioVenta, productoPedido.precioPromo);
        const precioFinal = !isNaN(productoPedido.precioPromo) && productoPedido.precioPromo !== null ? productoPedido.precioPromo : productoPedido.precioVenta;
        const subtotal = calcularSubtotal(precioFinal, productoPedido.cantidad);

        return (
            <div className="flex flex-row w-full items-center p-2 border-b mq980:flex-col" key={index}>
              <div className="w-[30%] flex flex-row mq980:w-full mq980:items-center">
                <div className="w-[30%] mq980:w-auto">
                    <img 
                        src={producto.imagen ? `https://back.paravosdistribuidora.com.ar/${producto.imagen.split(',')[0]}` : ""} 
                        alt={producto.name || "No encontrado"} 
                        className="w-16 h-16 object-cover shadow-md"
                    />
                </div>
                <p className="font-semibold w-[70%] mq980:w-auto">
                    {producto.name || productoDetalle.nombre || "No encontrado"}
                </p>
                </div>
                <div className="w-[70%] flex flex-row mq980:w-full mq980:justify-between">
                <div className="w-[40%] mq980:w-auto">
                    {(!isNaN(productoPedido.precioPromo) && productoPedido.precioPromo !== null) ? (
                        <div className="flex flex-col">
                            <div className="flex flex-row">
                                <p className="text-gris line-through mq980:hidden">${productoPedido.precioVenta}</p>
                                <p className="ml-1 font-semibold">${productoPedido.precioPromo}</p>
                            </div>
                            <p className="text-green-700 mq980:hidden">{descuento !== null ? `${descuento}% de descuento` : ''}</p>
                        </div>
                    ) : (
                        <p className="font-semibold">${productoPedido.precioVenta}</p>
                    )}
                </div>
                <p className="w-[30%] mq980:w-auto text-start">{productoPedido.cantidad}</p>
                <p className="w-[30%] mq980:w-auto text-start">${subtotal}</p>
            </div>
            </div>
        );
    })}
</div>



            <div className=" flex flex-row w-[100%] py-4 px-2 ">
                <div className="flex flex-row w-[30%] mq980:hidden">
                    <div className="w-[30%]"></div>
                    <div className="w-[70]"></div>
                </div>  
                <div className="w-[70%] flex flex-row mq980:w-full">
                    <div className="w-[40%]"></div>
                    <div className="w-[30%] font-bold text-xl">Total</div>
                    <div className="w-[30%] font-bold text-xl mq980:mr-2"> ${pedido.total}</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
