import User from '../modules/users/user.model.js';

export const existeEmail = async (email = '') => {
    const existe = await User.findOne({ email });
    if (existe) {
        throw new Error(`The email: ${email} is already registered`);
    }
};
