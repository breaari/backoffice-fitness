export const isValidId = //async 
(id) => {
    try {
        if (!id) {
            return { valid: false, error: "*El Id es requerido" };
        }

        const idRegex = /^[0-9]+$/;

        if (!idRegex.test(id.toString().trim())) {
            return { valid: false, error: "*El Id debe contener solo caracteres numéricos" };
        }

        if (id > 100000) {
            return { valid: false, error: "*El Id debe contener máximo 5 caracteres" };
        }

        // const response = await axios.get(`https://tu-servidor.com/validar-id/${id}`);

        // if (response.data.exists) {
        //     return { valid: false, error: "El ID ya existe en la base de datos" };
        // }

        return { valid: true, error: "" };
    } catch (error) {

        console.error('Error al validar el ID:', error);
        return { valid: false, error: "Error al validar el ID" };
        
    }
}