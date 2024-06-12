import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export const VerPedido = () => {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [productosDetalles, setProductosDetalles] = useState([]);
  const [usuario, setUsuario] = useState(null);

  console.log("pedido:", productosDetalles)

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const response = await axios.get(`/pedido/${id}`);
        const pedidoData = response.data.pedido;
        setPedido(pedidoData);

        // Obtener detalles de los productos
        const productosData = await Promise.all(
          pedidoData.pedido.map(async (producto) => {
            const productoResponse = await axios.get(`/productos/${producto.productId}`);
            return { ...productoResponse.data, cantidad: producto.cantidad };
          })
        );

        setProductosDetalles(productosData);

        // Obtener detalles del usuario
        const usuarioResponse = await axios.get(`/usuarios/${pedidoData.userId}`);
        setUsuario(usuarioResponse.data);

      } catch (error) {
        console.error("Error fetching pedido:", error);
      }
    };

    fetchPedido();
  }, [id]);

  if (!pedido || !usuario) {
    return (
        <div className='flex w-[79%] h-screen justify-center items-center'>
            <box-icon name='loader-circle' animation='spin' color='#C41111' size="70px"></box-icon>
        </div>
    )
  }

  const detallesEnvio = () => {
    if (pedido.metodo_envio === "envio gratis") {
      return (
        <>
          <p><strong>Indicaciones de entrega:</strong> {pedido.indicaciones_entrega || 'N/A'}</p>
          <p><strong>Tipo de dirección:</strong> {pedido.tipo_direccion || 'N/A'}</p>
        </>
      );
    } else if (pedido.metodo_envio === "por correo") {
      return (
        <>
          <p><strong>Sucursal o domicilio:</strong> {pedido.sucursal_o_domicilio}</p>
          <p><strong>Empresa de transporte:</strong> {pedido.empresa_transporte}</p>
          <p><strong>Link de seguimiento:</strong> {pedido.link_seguimiento || 'N/A'}</p>
        </>
      );
    } else {
      return null; // Manejar otros métodos de envío según sea necesario
    }
  };

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
  return (
    <div className="w-[79%] mt-20">
      <div className="w-full h-full p-12 bg-white flex flex-col">
        <div className="flex flex-row justify-around">
            <div className="border shadow-md rounded-sm p-4">
                <h1 className="font-bold text-2xl mb-4">Detalles del pedido</h1>
                    <div className=" flex flex-col">
                        <div className="flex flex-row">
                            <p className="mr-2"><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleDateString()}</p>
                            <p><strong>Hora:</strong> {pedido.hora}</p>
                        </div>
                        <p><strong>Estado:</strong> {pedido.estado}</p>
                        <div className="flex flex-col">
                            <p><strong>Dirección de entrega:</strong> {pedido.direccion_entrega}</p>
                            <p><strong>Método de envío:</strong> {pedido.metodo_envio}</p>
                            {detallesEnvio()}
                            <p><strong>Total:</strong> ${pedido.total}</p>
                        </div>
                    </div>
            </div>
                <div className="flex flex-col border shadow-md rounded-sm p-4">
                    <h1 className="font-bold text-2xl mb-4">Información del usuario</h1>
                    <p><strong>Usuario:</strong> {usuario.usuario}</p>
                    <p><strong>Número de contacto:</strong> {pedido.numero_contacto}</p>
                    <p><strong>Email:</strong> {usuario.email}</p>
                </div>
        </div>
        <div className="flex flex-col border shadow-md rounded-sm p-4 mt-12">
            <h1 className="font-bold text-2xl mb-4">Lista de productos</h1>
            <div className=" flex flex-row w-[100%] font-bold py-4 border-b px-2">
                <div className="flex flex-row w-[30%]">
                    <div className="w-[30%]"></div>
                    <div className="w-[70]">Nombre</div>
                </div>  
                <div className="w-[70%] flex flex-row ">
                    <div className="w-[40%]">Valor</div>
                    <div className="w-[30%]">Cantidad</div>
                    <div className="w-[30%]">Subtotal</div>
                </div>
            </div>
            <div className="flex flex-row w-[100%] border-b p-2">
                {productosDetalles.length > 1 ? (
                        productosDetalles.map((producto) => (
                            <div className="w-[30%] flex flex-row items-center">
                                <div className="w-[30%]">
                                    <img 
                                            src={`https://back.paravosdistribuidora.com.ar/${producto.imagen.split(',')[0]}`} 
                                            alt={producto.name} 
                                            className="w-16 h-16 object-cover shadow-md"
                                    />
                                </div>
                                <p className=" font-semibold w-[70%]"><strong>Nombre:</strong> {producto.producto.name}</p>
                            </div>
                        ))
                        ) : (
                            <div className="flex flex-row w-[30%] items-center">
                                <div className="w-[30%]">
                                <img 
                                        src={`https://back.paravosdistribuidora.com.ar/${productosDetalles[0].producto.imagen.split(',')[0]}`} 
                                        alt={productosDetalles[0].producto.name} 
                                        className="w-16 h-16 object-cover shadow-md"
                                />
                                </div>
                                <p className="font-semibold w-[70%]">{productosDetalles[0].producto.name}</p>
                            </div>
                        )}
                        {pedido.pedido.map((producto) => {
                                const descuento = calcularDescuento(producto.precioVenta, producto.precioPromo);
                                const precioFinal = !isNaN(producto.precioPromo) && producto.precioPromo !== null ? producto.precioPromo : producto.precioVenta;
                                const subtotal = calcularSubtotal(precioFinal, producto.cantidad);
                                return (
                                    <div className="flex flex-row w-[70%] items-center" key={producto.productId}>
                                        {(!isNaN(producto.precioPromo) && producto.precioPromo !== null) ? (
                                            <div className=" flex flex-col w-[40%]">
                                                <div className="flex flex-row">
                                                    <p className="text-gris line-through">${producto.precioVenta}</p>
                                                    <p className="ml-1 font-semibold">${producto.precioPromo}</p>
                                                </div>
                                                <p className="text-green-700">{descuento !== null ? `${descuento}% de descuento` : ''}</p>
                                            </div>
                                        ) : (
                                            <p className="font-semibold  w-[40%]">${producto.precioVenta}</p>
                                        )}
                                        <p className=" w-[30%]">{producto.cantidad}</p>
                                        <p className=" w-[30%]">{subtotal}</p>
                                    </div>
                                );
                            })}  
            </div>
            <div className=" flex flex-row w-[100%] py-4 px-2">
                <div className="flex flex-row w-[30%]">
                    <div className="w-[30%]"></div>
                    <div className="w-[70]"></div>
                </div>  
                <div className="w-[70%] flex flex-row ">
                    <div className="w-[40%]"></div>
                    <div className="w-[30%]"></div>
                    <div className="w-[30%] font-bold text-xl">Total ${pedido.total}</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
