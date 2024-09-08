// import { useState, useEffect } from "react";
// import { IoMdAddCircleOutline } from "react-icons/io";
// import { useNavigate } from "react-router-dom";
// import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
// import { RiDeleteBin6Fill } from "react-icons/ri";
// import { FaEye } from "react-icons/fa";
// import axios from "axios";
// import { ToastContainer, Zoom, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// export const Listadepedidos = () => {
//   const [pedidos, setPedidos] = useState([]);
//   const [usuarios, setUsuarios] = useState({});
//   const [detallesVisibles, setDetallesVisibles] = useState({});
//   const navigate = useNavigate();

//   const goTo = (path) => {
//     navigate(path);
//   };

//   useEffect(() => {
//     const fetchPedidos = async () => {
//         try {
//             const response = await axios.get("/pedido");
//             const pedidosData = response.data.pedidos;

//             const usuariosData = await Promise.all(
//                 pedidosData.map(async (pedido) => {
//                     try {
//                         const usuarioResponse = await axios.get(`/usuarios/${pedido.userId}`);
//                         return { userId: pedido.userId, usuario: usuarioResponse.data };
//                     } catch (error) {
        
//                         if (error.response && error.response.status === 404) {
//                             return { userId: pedido.userId, usuario: { nombre: "No encontrado" } };
//                         }
                 
//                         throw error;
//                     }
//                 })
//             );

//             const usuariosMap = {};
//             usuariosData.forEach((data) => {
//                 usuariosMap[data.userId] = data.usuario;
//             });

//             setPedidos(pedidosData);
//             setUsuarios(usuariosMap);
//         } catch (error) {
//             console.error("Error fetching pedidos:", error);
//         }
//     };

//     fetchPedidos();
// }, []);


//   const handleDelete = async (pedidoId) => {
//     try {
//       await axios.delete(`/pedido/${pedidoId}`);

//       setPedidos((prevPedidos) => prevPedidos.filter((pedido) => pedido.id !== pedidoId));
//       toast.success('Pedido eliminado exitosamente', {
//         toastId: 'delete-success-toast',
//     });
//     } catch (error) {
//         toast.error('Error al eliminar pedido', {
//             toastId: 'not-found-toast',
//         });
//       console.error("Error deleting pedido:", error);
//     }
//   };

//   const handleEstadoChange = async (pedidoId, nuevoEstado) => {
//     try {
//       const response = await axios.put(`/pedido/${pedidoId}`, { estado: nuevoEstado });
      
//       if (response.status === 200) {
//         setPedidos((prevPedidos) =>
//           prevPedidos.map((pedido) =>
//             pedido.id === pedidoId ? { ...pedido, estado: nuevoEstado } : pedido
//           )
//         );
//         console.log("Estado del pedido actualizado con éxito");
//       } else {
//         console.error("Error al actualizar el estado del pedido:", response.data);
//       }
//     } catch (error) {
//       console.error("Error updating estado:", error);
//     }
//   };

//   return (
//     <div className="w-[79%] mt-20 mq980:w-full">
//       <div className="w-full h-full p-6">
//         <div className="flex flex-row bg-white justify-between">
//           <h1 className="font-bold text-2xl">Pedidos</h1>
//           <div className="flex flex-row bg-rojo text-white text-[14px] items-center font-semibold px-2 py-1 rounded-md">
//             <IoMdAddCircleOutline />
//             <button className="ml-1" onClick={() => goTo('/admin/listadepedidos/agregarpedido')}>Agregar pedido</button>
//           </div>
//         </div>
//         <div className="mt-4">
//           {pedidos.length === 0 ? (
//             <p>No hay pedidos disponibles.</p>
//           ) : (
//             <div className="w-full flex flex-col">
//               <div className="flex flex-row items-center font-bold text-lg">
//                 <div className="border-b w-[12%] py-2 mq980:w-[25%]">Fecha</div>
//                 <div className="border-b w-[12%] py-2 mq980:hidden">Hora</div>
//                 <div className="border-b w-[14%] py-2 mq980:w-[25%]">Usuario</div>
//                 <div className="border-b w-[18%] py-2 mq980:hidden">Método de envío</div>
//                 <div className="border-b w-[14%] py-2 mq980:hidden">Total</div>
//                 <div className="border-b w-[14%] py-2 mq980:w-[30%]">Estado</div>
//                 <div className="border-b w-[14%] py-2 mq980:w-[20%] text-end">Acciones</div>
//               </div>
//               {pedidos.map((pedido) => (
//                 <div key={pedido.id} className="flex flex-col">
//                   <div className="flex flex-row items-center">
//                     <div className="border-b w-[12%] py-4 mq980:w-[25%]">{new Date(pedido.fecha).toLocaleDateString()}</div>
//                     <div className="border-b w-[12%] py-4 mq980:hidden">{pedido.hora}</div>
//                     <div className="border-b w-[14%] py-4 mq980:w-[25%]">{usuarios[pedido.userId]?.usuario || "Cargando..."}</div>
//                     <div className="border-b w-[18%] py-4 mq980:hidden">{pedido.metodo_envio}</div>
//                     <div className="border-b w-[14%] py-4 mq980:hidden">${pedido.total}</div>
//                     <div className="border-b w-[14%] py-4 mq980:w-[30%]">
//                       <select
//                         value={pedido.estado}
//                         onChange={(e) => handleEstadoChange(pedido.id, e.target.value)}
//                         className="focus:outline-none"
//                       >
//                         <option value="pendiente">Pendiente</option>
//                         <option value="pago exitoso">Pago exitoso</option>
//                         <option value="pago rechazado">Pago rechazado</option>
//                         <option value="en proceso">En proceso</option>
//                         <option value="enviado">Enviado</option>
//                         <option value="entregado">Entregado</option>
//                       </select>
//                     </div>
//                     <div className="border-b w-[14%] py-4 flex items-center mq980:w-[20%] mq980:items-end justify-end">
//                       <button
//                         className="bg-gray-500 text-white  p-1 rounded"
//                         onClick={() => goTo(`/admin/listadepedidos/${pedido.id}`)}
//                       >
//                         <FaEye className="text-[18px]"/>
//                       </button>
//                       <button className="bg-rojo text-white p-1 rounded"
//                             onClick={() => handleDelete(pedido.id)}
//                         >
//                             <RiDeleteBin6Fill className="text-[18px]"/>
//                         </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//       <ToastContainer
//                   position="top-right"
//                   autoClose={5000}
//                   hideProgressBar={false}
//                   newestOnTop={false}
//                   closeOnClick
//                   rtl={false}
//                   pauseOnFocusLoss
//                   draggable
//                   pauseOnHover
//                   limit={1}
//                   queue={false}
//                   theme="colored"
//                   transition={Zoom}
//                 />
//     </div>
//   );
// };
import { useState, useEffect } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Listadepedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [detallesVisibles, setDetallesVisibles] = useState({});
  const navigate = useNavigate();

  const goTo = (path) => {
    navigate(path);
  };

  // useEffect(() => {
  //   const fetchPedidos = async () => {
  //     try {
  //       const response = await axios.get("/pedido");
  //       const pedidosData = response.data.pedidos;
  //       console.log("pedidosData:", pedidosData)

  //       const usuariosData = await Promise.all(
  //         pedidosData.map(async (pedido) => {
  //           try {
  //             const usuarioResponse = await axios.get(`/usuarios/${pedido.userId}`);
  //             return { userId: pedido.userId, usuario: usuarioResponse.data };
  //           } catch (error) {
  //             if (error.response && error.response.status === 404) {
  //               return { userId: pedido.userId, usuario: { nombre: "No encontrado" } };
  //             }
  //             throw error;
  //           }
  //         })
  //       );

  //       const usuariosMap = {};
  //       usuariosData.forEach((data) => {
  //         usuariosMap[data.userId] = data.usuario;
  //       });

  //       // Ordenar los pedidos por fecha (más reciente primero)
  //       pedidosData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  //       setPedidos(pedidosData);
  //       setUsuarios(usuariosMap);
  //     } catch (error) {
  //       console.error("Error fetching pedidos:", error);
  //     }
  //   };

  //   fetchPedidos();
  // }, []);

  useEffect(() => {
    const fetchPedidos = async () => {
        try {
            const response = await axios.get("/pedido");
            const pedidosData = response.data.pedidos;
            console.log("pedidosData:", pedidosData);

            const usuariosData = await Promise.all(
                pedidosData
                    .filter(pedido => pedido.userId !== null) // Filtrar pedidos con userId no nulo
                    .map(async (pedido) => {
                        try {
                            const usuarioResponse = await axios.get(`/usuarios/${pedido.userId}`);
                            return { userId: pedido.userId, usuario: usuarioResponse.data };
                        } catch (error) {
                            if (error.response && error.response.status === 404) {
                                return { userId: pedido.userId, usuario: { nombre: "No encontrado" } };
                            }
                            throw error;
                        }
                    })
            );

            const usuariosMap = {};
            usuariosData.forEach((data) => {
                usuariosMap[data.userId] = data.usuario;
            });

            // Ordenar los pedidos por fecha (más reciente primero)
            pedidosData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

            setPedidos(pedidosData);
            setUsuarios(usuariosMap);
        } catch (error) {
            console.error("Error fetching pedidos:", error);
        }
    };

    fetchPedidos();
}, []);


  const handleDelete = async (pedidoId) => {
    try {
      await axios.delete(`/pedido/${pedidoId}`);

      setPedidos((prevPedidos) => prevPedidos.filter((pedido) => pedido.id !== pedidoId));
      toast.success('Pedido eliminado exitosamente', {
        toastId: 'delete-success-toast',
      });
    } catch (error) {
      toast.error('Error al eliminar pedido', {
        toastId: 'not-found-toast',
      });
      console.error("Error deleting pedido:", error);
    }
  };

  const handleEstadoChange = async (pedidoId, nuevoEstado) => {
    try {
      const response = await axios.put(`/pedido/${pedidoId}`, { estado: nuevoEstado });

      if (response.status === 200) {
        setPedidos((prevPedidos) =>
          prevPedidos.map((pedido) =>
            pedido.id === pedidoId ? { ...pedido, estado: nuevoEstado } : pedido
          )
        );
        console.log("Estado del pedido actualizado con éxito");
      } else {
        console.error("Error al actualizar el estado del pedido:", response.data);
      }
    } catch (error) {
      console.error("Error updating estado:", error);
    }
  };

  return (
    <div className="w-[79%] mt-20 mq980:w-full">
      <div className="w-full h-full p-6">
        <div className="flex flex-row bg-white justify-between">
          <h1 className="font-bold text-2xl">Pedidos</h1>
          <div className="flex flex-row bg-rojo text-white text-[14px] items-center font-semibold px-2 py-1 rounded-md">
            <IoMdAddCircleOutline />
            <button className="ml-1" onClick={() => goTo('/admin/listadepedidos/agregarpedido')}>Agregar pedido</button>
          </div>
        </div>
        <div className="mt-4">
          {pedidos.length === 0 ? (
            <p>No hay pedidos disponibles.</p>
          ) : (
            <div className="w-full flex flex-col">
              <div className="flex flex-row items-center font-bold text-lg">
                <div className="border-b w-[15%] py-2 mq980:w-[25%]">Fecha</div>
                <div className="border-b w-[15%] py-2 mq980:hidden">Hora</div>
                <div className="border-b w-[15%] py-2 mq980:w-[25%]">Usuario</div>
                {/* <div className="border-b w-[18%] py-2 mq980:hidden">Método de envío</div> */}
                <div className="border-b w-[18%] py-2 mq980:hidden">Total</div>
                <div className="border-b w-[18%] py-2 mq980:w-[30%]">Estado</div>
                <div className="border-b w-[18%] py-2 mq980:w-[20%]">Acciones</div>
              </div>
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="flex flex-col">
                  <div className="flex flex-row items-center">
                    <div className="border-b w-[15%] py-4 mq980:w-[25%]">{new Date(pedido.fecha).toLocaleDateString()}</div>
                    <div className="border-b w-[15%] py-4 mq980:hidden">{pedido.hora}</div>
                    <div className="border-b w-[15%] py-4 mq980:w-[25%]">{usuarios[pedido.userId]?.usuario || "Sin usuario"}</div>
                    {/* <div className="border-b w-[18%] py-4 mq980:hidden">{pedido.metodo_envio}</div> */}
                    <div className="border-b w-[18%] py-4 mq980:hidden">${pedido.total}</div>
                    <div className="border-b w-[18%] py-4 mq980:w-[30%]">
                      <select
                        value={pedido.estado}
                        onChange={(e) => handleEstadoChange(pedido.id, e.target.value)}
                        className="focus:outline-none"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="pago exitoso">Pago exitoso</option>
                        <option value="pago rechazado">Pago rechazado</option>
                        <option value="en proceso">En proceso</option>
                        <option value="enviado">Enviado</option>
                        <option value="entregado">Entregado</option>
                      </select>
                    </div>
                    <div className="border-b w-[14%] py-4 flex items-center mq980:w-[20%] mq980:items-end">
                      <button
                        className="bg-gray-500 text-white  p-1 rounded"
                        onClick={() => goTo(`/admin/listadepedidos/${pedido.id}`)}
                      >
                        <FaEye className="text-[18px]"/>
                      </button>
                      <button className="bg-rojo text-white p-1 rounded"
                            onClick={() => handleDelete(pedido.id)}
                        >
                            <RiDeleteBin6Fill className="text-[18px]"/>
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
