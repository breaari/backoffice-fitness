export const isValidName = (name) => {
    try {
        if (!name) {
            return { valid: false, error: '*El nombre es requerido' };
        }

        if (name.length > 100) {
            return { valid: false, error: '*El nombre no debe tener más de 100 caracteres' };
        }

        if (name.length < 2) {
            return { valid: false, error: '*El nombre debe tener al menos 2 caracteres' };
        }

        if (name.trim() !== name) {
            return { valid: false, error: '*El nombre no debe contener espacios al inicio o al final' };
        }

        //el nombre no debe ser igual al de ningún otro producto

        return { valid: true };
    } catch (error) {
        return { valid: false, error: '*Error al validar el nombre' };
    }
};