export const isValidDescripcion = (descripcion) => {
    try {

        if (descripcion.length > 999) {
            return { valid: false, error: "*La descripción no puede tener más de 1000 caracteres" };
        }

        return { valid: true, error: "" };
    } catch (error) {
        console.error('Error al validar la descripción:', error);
        return { valid: false, error: "*Error al validar la descripción" };
    }
};
