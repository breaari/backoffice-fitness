import React from 'react'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './Redux/store.jsx'
import { createRoot } from 'react-dom/client';
import axios from 'axios'


// axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.baseURL = 'https://back.paravosdistribuidora.com.ar'

const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);