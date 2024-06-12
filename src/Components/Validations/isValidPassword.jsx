export const isValidPassword = (password) => {

    try {
        if (!password) {
            return { valid: false, error: 'La contraseña es requerida' };
        }

        if (password.length < 8) {
            return { valid: false, error: 'La contraseña debe tener al menos 8 caracteres' };
        }

        if (!/[A-Z]+/.test(password) || !/[a-z]+/.test(password)) {
            return { valid: false, error: 'La contraseña debe contener al menos una mayúscula y una minúscula' };
        }

        if (!/[^A-Za-z0-9\s]/.test(password)) {
            return { valid: false, error: 'La contraseña debe contener al menos un caracter especial' };
        }

        const consecutiveNumbers = /012|123|234|345|456|567|678|789/;
        if (consecutiveNumbers.test(password)) {
            return { valid: false, error: 'La contraseña no puede contener números en escalera o consecuentes' };
        }
        
        return { valid: true };
    } catch (error) {
        return { valid: false, error: 'Error al validar la contraseña' };
    }
};