import React, { useState } from 'react';
import { FiSearch } from "react-icons/fi";
import { IoFilter } from "react-icons/io5";

export const SearchProductos = ({ 
                                  query, 
                                  setQuery, 
                                  handleSearch, 
                                  categorias, 
                                  selectedCategoria, 
                                  subcategorias, 
                                  selectedSubcategoria, 
                                  selectedStock,
                                  handleChangeCategoria,
                                  handleChangeSubcategoria,
                                  handleChangeStock,
                                  toggleFilter,
                                  showFilter,
                                  handleResetFilter 
                                }) => {
  return (
    <div className='my-4 flex flex-row justify-between'>
      <form onSubmit={ handleSearch } className='w-[94%]'>
        <div className='flex flex-row w-full justify-between'>
          <label className='border-grismedio border rounded-md p-1 flex flex-row items-center w-[74%]'>
            <FiSearch className='text-grismedio text-[22px]' />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos por nombre..."
              className=' px-2 focus:outline-none w-[700px]'
            />
          </label>
          <button type="submit" className='text-white px-2 py-1 bg-rojo font-bold rounded-md w-[25%]'>Buscar</button>
        </div>
      </form>
      <button className='w-[5%]' onClick={toggleFilter}>
        <IoFilter className='text-[30px] mx-2' />
      </button>
      {showFilter && (
        <div className='absolute top-[200px] right-[30px] bg-white p-4 border border-gray-300 rounded-md shadow-lg z-50'>
          <div className='flex flex-row items-center justify-between'>
          <p className='font-bold mb-2'>Filtros</p>
          <button className="text-sm mb-2 text-rojo hover:underline" onClick={handleResetFilter}>Limpiar filtros</button>
          </div>
          <div className='flex flex-row items-center'>
            <label className='text-sm'>Categoria:</label>
            <select
              value={selectedCategoria}
              onChange={handleChangeCategoria}
              className='text-sm rounded-md p-1 focus:outline-none'
            >
              <option value="" disabled>Seleccioná</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
              <option value= "">Todas</option>
            </select>
          </div>
          <div className='mt-2'>
            <label className='text-sm'>Subcategoria:</label>
            <select
              className='text-sm rounded-md p-1 focus:outline-none'
              value={selectedSubcategoria}
              onChange={handleChangeSubcategoria}
            >
              <option disabled value="">Seleccioná</option>
              {subcategorias.map((subcategoria) => (
                <option key={subcategoria.id} value={subcategoria.id}>
                  {subcategoria.nombre}
                </option>
              ))}
              <option value= "">Todas</option>
            </select>
          </div>
          <div className='mt-2'>
            <label className='text-sm'>Stock:</label>
            <select
              className='text-sm rounded-md p-1 focus:outline-none'
              value={selectedStock}
              onChange={handleChangeStock}
            >
              <option value="" disabled>Seleccioná</option>
              <option value="con_stock">Con stock</option>
              <option value="sin_stock">Sin stock</option>
              <option value= "">Todo</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

