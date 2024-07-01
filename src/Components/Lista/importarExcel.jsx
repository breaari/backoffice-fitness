import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ImportarExcel = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleImportClick = async () => {
    if (!file) {
        toast.error('Por favor, selecciona un archivo.', {
            toastId: 'delete-error-toast',
        });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/import-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }); 

      console.log("response:", response)

      toast.success('Importación exitosa', {
        toastId: 'delete-success-toast',
    });

    } catch (error) {
      toast.error('Error al importar', {
        toastId: 'delete-error-toast',
    });
    }
  };

  const exportProducts = async () => {
    try {
      const response = await axios.get('/export-excel', {
        responseType: 'blob',
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'productos.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al exportar productos:', error);
    }
  };

  return (
    <div className='flex flex-row justify-between mq980:items-start items-center m-2 mq980:flex-col'>
        <div className=''>
            <button onClick={exportProducts} className='mq980:my-1 mq980:w-[100px] bg-gray-400 text-white text-sm py-1 px-2 rounded-sm font-semibold hover:scale-95'>Exportar xls</button>
        </div>
        <div className='mq980:flex mq980:flex-col'>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className='text-sm mq980:my-1'/>
            <button onClick={handleImportClick} className=' mq980:my-1 mq980:w-[100px] ml-2 mq980:ml-0 bg-gray-400 text-white text-sm py-1 px-2 rounded-sm font-semibold hover:scale-95'>Importar</button>
            {message && <p className='text-sm'>{message}</p>}
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

