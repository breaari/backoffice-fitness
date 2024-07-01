import React, { useState } from 'react';
import { FiSearch } from "react-icons/fi";
import { IoFilter } from "react-icons/io5";

export const SearchUsuarios = ({ query, setQuery, handleSearch,  tipo, setTipo, handleResetFilter }) => {

    const [showFilter, setShowFilter] = useState(false);

    const toggleFilter = () => {
      setShowFilter(prevState => !prevState);
    };

  return (
    <div className='my-4'>
      <form onSubmit={handleSearch}>
        <div className='flex flex-row w-full justify-between'>
          <label className='border-grismedio border rounded-md p-1 flex flex-row items-center w-[69%] mq980:w-[85%]'>
            <FiSearch className='text-grismedio text-[22px]' />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar usuarios por nombre o email..."
              className=' px-2 focus:outline-none w-[700px] mq980:w-[240px]'
            />
          </label>
          <button type="submit" className='text-white px-2 py-1 bg-rojo font-bold rounded-md w-[20%] mq980:hidden'>Buscar</button>
          <button className='w-[10%] mq980:w-[15%]'  onClick={toggleFilter}>
              <IoFilter className='text-[30px] mx-2' />
          </button>
        </div>
        {showFilter && (
          <div className='absolute top-[200px] right-[70px] mq980:right-6 bg-white p-4 border border-gray-300 rounded-md shadow-lg z-50'>
            <div className='flex flex-row items-center justify-between'>
              <p className='font-bold mb-2'>Filtros</p>
              <button className="text-sm mb-2 text-rojo hover:underline" onClick={handleResetFilter}>Limpiar filtros</button>
            </div>
            <div className='flex flex-row items-center'>
            <label className='text-sm'>Tipo:</label>
            <select
              value={tipo}
              onChange={(e) => {
                setTipo(e.target.value);
                setShowFilter(false);
            }}
              className='text-sm rounded-md p-1 focus:outline-none'
            >
              <option value="">Todos</option>
              <option value="administrador">Administrador</option>
              <option value="usuario_comun">Usuario Común</option>
            </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
