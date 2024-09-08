import User from '../modules/users/user.model.js';

export const existeEmail = async (email = '') => {
    const existe = await User.findOne({email})
    if(existe){
        throw new Error(`The email ${email} has already been registered`)
    }
}

export const existeUsuarioById = async (id = '') =>{
    const existeUsuario = await User.findById(id)
    if(!existeUsuario){
        throw new Error(` The ID: ${id} does not exist` )
    }
}
