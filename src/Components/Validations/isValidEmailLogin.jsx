export const isValidEmailLogin = async (email) => {
 
  try {
    if (!email) {
      return { valid: false, error: "El email es requerido" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(email.trim())) {
      return { valid: false, error: "El email no tiene un formato válido" };
    }

    return { valid: true, error: "" };
  } catch (error) {
    return { valid: false, error: "Error al validar el email" };
  }
};
