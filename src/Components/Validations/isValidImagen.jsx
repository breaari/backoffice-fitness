export const isValidImagen = async (imagen) => {

        // Función auxiliar para verificar si una cadena es una URL válida
    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    };

    try {
        // Verificar si imagen es un array
        if (!Array.isArray(imagen)) {
            return { valid: false, error: "La imagen debe ser un array" };
        }

        // Verificar si hay al menos una URL de imagen en el array
        if (imagen.length === 0) {
            return { valid: false, error: "Debe haber al menos una URL de imagen" };
        }

        // Verificar que cada elemento del array sea una URL de imagen válida
        for (const url of imagen) {
            if (typeof url !== "string" || !isValidUrl(url)) {
                return { valid: false, error: "Cada elemento del array debe ser una URL de imagen válida" };
            }

            // Verificar si la URL de imagen es accesible y refleja una imagen
            try {
                const response = await axios.head(url);
                if (response.status !== 200 || !response.headers['content-type'] || !response.headers['content-type'].startsWith('image')) {
                    return { valid: false, error: `La URL '${url}' no es accesible o no refleja una imagen` };
                }
            } catch (error) {
                return { valid: false, error: `Error al verificar la URL '${url}': ${error.message}` };
            }
        }

        return { valid: true, error: "" }; // Todas las validaciones pasan
    } catch (error) {
        console.error('Error al validar la imagen:', error);
        return { valid: false, error: "Error al validar la imagen" };
    }
};


