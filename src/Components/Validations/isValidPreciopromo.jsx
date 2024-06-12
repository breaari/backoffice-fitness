export const isValidPreciopromo = (preciopromo, precioventa, preciocompra) => {
    try {
        if (preciopromo === '') {
            return { valid: true, error: '' };
        }
        // Verificar si el precio de promoción es un número
        if (isNaN(preciopromo)) {
            return { valid: false, error: "*El precio de promoción debe ser un número" };
        }

        // Verificar si el precio de promoción es menor que 0
        if (preciopromo < 0) {
            return { valid: false, error: "*El precio de promoción no puede ser menor que 0" };
        }

        // Verificar si el precio de promoción tiene solo dos decimales
        if (!(/^\d+(\.\d{1,2})?$/).test(preciopromo.toString())) {
            return { valid: false, error: "*El precio de promoción debe tener sólo dos decimales" };
        }

        // Verificar si el precio de promoción es mayor que el precio de compra
        if (preciopromo < preciocompra) {
            return { valid: false, error: "*El precio de promoción no puede ser menor que el precio de compra" };
        }

        // Verificar si el precio de promoción es menor que el precio de venta
        if (preciopromo > precioventa) {
            return { valid: false, error: "*El precio de promoción debe ser menor que el precio de venta" };
        }

        return { valid: true, error: "" }; // Todas las validaciones pasan
    } catch (error) {
        console.error('Error al validar el precio de promoción:', error);
        return { valid: false, error: "*Error al validar el precio de promoción" };
    }
};
