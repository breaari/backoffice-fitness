export const isValidStock = (stock) => {
    console.log("Stock valid:", stock)
    console.log("Stock limitado valid:", stock.limitado)
    console.log("Stock infinito valid:", stock.infinito)

    try {
        // Verificar si stock es un objeto
        if (!stock || typeof stock !== "object") {
            return { valid: false, error: "El stock es requerido y debe ser un objeto" };
        }

        // Verificar si 'infinito' es true o false
        if (stock.infinito !== true && stock.infinito !== false) {
            return { valid: false, error: "El valor de 'infinito' debe ser true o false" };
        }

        if (stock.infinito === false) {

        if (!stock.limitado) {
            return { valid: false, error: "Limitado debe tener un valor si infinito es false" };
        }

        // Verificar si 'limitado' es un número
        if (stock.limitado) {
            if (isNaN(stock.limitado)) {
                return { valid: false, error: "El valor de 'limitado' debe ser un número" };
            }

            // Verificar si 'limitado' es menor que 0
            if (stock.limitado < 0) {
                return { valid: false, error: "El valor de 'limitado' no puede ser menor que 0" };
            }

            if (stock.limitado > 1000000) {
                return { valid: false, error: "El valor de 'limitado' no puede tener más de 6 cifras" };
            }
        }

        }

        return { valid: true, error: "" }; // Todas las validaciones pasan
    } catch (error) {
        console.error('Error al validar el stock:', error);
        return { valid: false, error: "Error al validar el stock" };
    }
};
