export const isValidPreciocompra = (preciocompra) => {
    try {
        // Verificar si el precio de compra es un número
        if (!preciocompra) {
            return { valid: false, error: "*El precio de compra es necesario" }
        }

        if (isNaN(preciocompra)) {
            return { valid: false, error: "*El precio de compra debe ser un número" };
        }

        // Verificar si el precio de compra es menor que 0
        if (preciocompra < 0) {
            return { valid: false, error: "*El precio de compra no puede ser menor que 0" };
        }

        if (preciocompra > 1000000) {
            return { valid: false, error: "*El precio de compra no puede ser mayor a 10.000.000,00" };
        }

        // Verificar si el precio de compra tiene solo dos decimales
        if (!(/^\d+(\.\d{1,2})?$/).test(preciocompra.toString())) {
            return { valid: false, error: "*El precio de compra debe tener sólo dos decimales" };
        }

        return { valid: true, error: "" }; // Todas las validaciones pasan
    } catch (error) {
        console.error('Error al validar el precio de compra:', error);
        return { valid: false, error: "*Error al validar el precio de compra" };
    }
};
