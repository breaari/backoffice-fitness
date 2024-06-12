export const isValidUsuario = (usuario) => {
    try {
        if (!usuario) {
            return { valid: false, error: 'El nombre es requerido' };
        }

        if (usuario.length > 35) {
            return { valid: false, error: 'El nombre no debe tenamener más de 35 caracteres' };
        }

        if (usuario.length < 2) {
            return { valid: false, error: 'El nombre debe tener al menos 2 caracteres' };
        }

        if (usuario.trim() !== usuario) {
            return { valid: false, error: 'El nombre no debe contener espacios al inicio o al final' };
        }


        if (!/^[a-zA-Z ]+$/.test(usuario.trim())) {
            return { valid: false, error: 'El nombre solo puede contener letras' };
        }

        return { valid: true };
    } catch (error) {
        return { valid: false, error: 'Error al validar el nombre' };
    }
};