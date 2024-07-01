import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '../src/Redux/loadingSlice';
import { Login } from './Components/Inicio/Inicio';
import { Panel } from './Components/Panel/Panel';
import { Agregar } from './Components/Agregar/Agregar';
import { Listadeproductos } from './Components/Lista/Listadeproductos';
import { Layout } from './layout';
import { Listadeusuarios } from './Components/Lista/Listadeusuarios';
import { Crearusuarios } from './Components/Agregar/Crearusuarios';
import { Editarusuarios } from './Components/Editar/editarUsuarios';
import { RutaProtegida } from './Components/AccesoDenegado/RutaProtegida';
import { AccesoDenegado } from './Components/AccesoDenegado/AccesoDenegado';
import boxicons from 'boxicons'
import { Listadecategorias } from './Components/Lista/Listadecategorias';
import { AgregarCategoriasYSubcategorias } from './Components/Agregar/AgregarCategoriasYSubcategorias';
import { EditarCategorias } from './Components/Editar/editarCategorias';
import { EditarSubcategoria } from './Components/Editar/editarSubcategoria';
import { EditarProducto } from './Components/Editar/editarProductos';
import { Listadecarritos } from './Components/Lista/Listadecarritos';
import { Listadepedidos } from './Components/Lista/Listadepedidos';
import { VerPedido } from './Components/Editar/verPedido';
import { AgregarPedido } from './Components/Agregar/agregarPedido';

function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [isLogged, setIsLogged ] = useState(true)
  console.log("is loading app", isLoading)

  useEffect(() => {
    dispatch(startLoading());
    const user = JSON.parse(localStorage.getItem('usuario'));
    console.log("user:", user)
    if (!user) {
      setIsLogged(false) 
      dispatch(stopLoading()); 
    } else {
      dispatch(stopLoading());
    }
  }, [dispatch]);

  if (isLoading) {
    return (
    <div className='flex justify-center items-center h-screen'>
      <box-icon name='loader-circle' animation='spin' color='#C41111' size="70px"></box-icon>
    </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/*" 
        element={
          <RutaProtegida isLogged={isLogged}>
            <Layout />
          </RutaProtegida>
        }>
          <Route index element={<Panel />} />
          <Route path="listadeproductos" element={<Listadeproductos />} />
          <Route path="listadeproductos/agregarproductos" element={<Agregar />} />
          <Route path="listadeproductos/editarproducto/:id" element={<EditarProducto/>} />


          <Route path="listadeusuarios" element={<Listadeusuarios />} />
          <Route path="listadeusuarios/crearusuarios" element={<Crearusuarios />} />
          <Route path="listadeusuarios/editarusuarios/:id" element={<Editarusuarios />} />
          
          <Route path="categorias" element={<Listadecategorias />} />
          <Route path="categorias/agregarcategorias" element={<AgregarCategoriasYSubcategorias></AgregarCategoriasYSubcategorias>} />
          <Route path="categorias/editarcategoria/:id" element={<EditarCategorias></EditarCategorias>}/>
          <Route path="categorias/editarsubcategoria/:id" element={<EditarSubcategoria/>}/>

          <Route path="listadecarritos" element={<Listadecarritos/>}/>

          <Route path='listadepedidos' element={<Listadepedidos/>}/>
          <Route path='listadepedidos/:id' element={<VerPedido/>}/>
          <Route path='listadepedidos/agregarpedido' element = {<AgregarPedido></AgregarPedido>} />
        </Route>
        <Route path="/acceso-denegado" element={<AccesoDenegado />} /> 
      </Routes>
    </Router>
  );
}

export default App;



