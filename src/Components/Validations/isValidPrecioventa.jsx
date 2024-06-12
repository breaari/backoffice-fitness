export const isValidPrecioventa = (precioventa, preciocompra) => {
    try {
        // Verificar si el precio de venta es un número
        if (isNaN(precioventa)) {
            return { valid: false, error: "El precio de venta debe ser un número" };
        }

        // Verificar si el precio de venta es menor que 0
        if (precioventa < 0) {
            return { valid: false, error: "El precio de venta no puede ser menor que 0" };
        }

        // Verificar si el precio de venta tiene solo dos decimales
        if (!(/^\d+(\.\d{1,2})?$/).test(precioventa.toString())) {
            return { valid: false, error: "El precio de venta debe tener sólo dos decimales" };
        }

        // Verificar si el precio de venta es menor que el precio de compra
        if (precioventa < preciocompra) {
            return { valid: false, error: "El precio de venta no puede ser menor que el precio de compra" };
        }

        return { valid: true, error: "" }; // Todas las validaciones pasan
    } catch (error) {
        console.error('Error al validar el precio de venta:', error);
        return { valid: false, error: "Error al validar el precio de venta" };
    }
};
