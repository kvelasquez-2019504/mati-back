import User from '../models/User.js'; // Importa tu modelo de usuario

export const existeEmail = async (email = '') => {
    const existe = await User.findOne({ email });
    if (existe) {
        throw new Error(`The email: ${email} is already registered`);
    }
};
