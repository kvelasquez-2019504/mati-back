import jwt from 'jsonwebtoken';
import User from '../modules/users/user.model.js'; // Asegúrate de que la ruta sea correcta

export const validarJWT = async (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers['authorization'];

    // Verificar si el token está presente
    if (!token) {
        return res.status(401).send('A token is required for authentication');
    }

    try {
        // Eliminar el prefijo 'Bearer ' si está presente
        /*  if (token.startsWith('Bearer ')) {
              token = token.slice(7, token.length);
          }*/

        // Verificar el token y extraer el uid
        const { uid } = jwt.verify(token, process.env.PRIVATE_KEY);
        // Buscar el usuario por uid
        const user = await User.findById(uid);

        // Verificar si el usuario existe
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Adjuntar el usuario a la solicitud
        req.user = user;

        // Continuar con la siguiente función middleware
        next();
    } catch (e) {
        console.log(e);
        return res.status(401).send('Invalid Token');
    }
};
