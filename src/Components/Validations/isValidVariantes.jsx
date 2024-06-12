export const isValidVariantes = (variantes) => {
    try {
        if (typeof variantes !== "object") {
            return { valid: false, error: "Las variantes son requeridas y deben ser un objeto" };
        }

        // Verificar que las variantes sean un objeto con al menos una propiedad
        const criterios = Object.keys(variantes);
        if (criterios.length === 0) {
            return { valid: false, error: "Las variantes deben tener al menos un criterio principal" };
        }

        // Verificar que cada valor del objeto sea un array de variaciones
        for (const criterio in variantes) {
            if (!Array.isArray(variantes[criterio])) {
                return { valid: false, error: `Las variaciones para el criterio '${criterio}' deben ser un array` };
            }
        }

        return { valid: true, error: "" };
    } catch (error) {
        console.error('Error al validar las variantes:', error);
        return { valid: false, error: "Error al validar las variantes" };
    }
};
