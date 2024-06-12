import axios from 'axios';

export const isValidEmail = async (email) => {
  console.log("emailvalid", email);
  try {
    if (!email) {
      return { valid: false, error: "El email es requerido" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(email.trim())) {
      return { valid: false, error: "El email no tiene un formato válido" };
    }

    const response = await axios.get('/usuarios');
    const usuarios = response.data;
    const emailExists = usuarios.usuarios.some(usuario => usuario.email === email.trim());

    if (emailExists) {
      return { valid: false, error: "El email ya está registrado" };
    }

    return { valid: true, error: "" };
  } catch (error) {
    return { valid: false, error: "Error al validar el email" };
  }
};
