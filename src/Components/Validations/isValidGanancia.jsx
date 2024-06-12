export const isValidGanancia = (ganancia) => {
    try {
        // Verificar si la ganancia está vacía
        if (ganancia === null || ganancia === undefined || ganancia === "") {
            return { valid: false, error: "*La ganancia es requerida" };
        }

        // Verificar si la ganancia es un número
        if (isNaN(ganancia)) {
            return { valid: false, error: "*La ganancia debe ser un número" };
        }

        // Verificar si la ganancia es menor que 0
        if (ganancia < 0) {
            return { valid: false, error: "*La ganancia no puede ser menor que 0%" };
        }

        // Verificar si la ganancia es mayor que 999
        if (ganancia > 999) {
            return { valid: false, error: "*La ganancia no debe ser mayor que 999%" };
        }

        // Verificar si la ganancia tiene solo dos decimales
        if (!(/^\d+(\.\d{1,2})?$/).test(ganancia.toString())) {
            return { valid: false, error: "*La ganancia debe tener sólo dos decimales" };
        }

        return { valid: true, error: "" }; // Todas las validaciones pasan
    } catch (error) {
        console.error('Error al validar la ganancia:', error);
        return { valid: false, error: "*Error al validar la ganancia" };
    }
};
