import { Router } from 'express';
import { createRequest, acceptRequest } from './request.controller.js';
import { validarJWT } from '../../middlewares/validar-jwt.js'; // Asegúrate de tener la validación del JWT
import isAdminGeneral from '../../middlewares/validar-role.js'; // Middleware para validar si es ADMIN_GENERAL

const router = Router();

// Ruta para crear una petición
router.post('/requests', validarJWT, createRequest);

// Ruta para aceptar una petición (solo ADMIN_GENERAL)
router.put('/accept/:requestId', validarJWT, isAdminGeneral, acceptRequest);

export default router;
