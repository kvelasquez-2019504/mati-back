import { Router } from 'express';
import { check } from 'express-validator';
import {
    startConversation,
    getConversations,
    getMessages
} from './message.controller.js';
import { validarCampos } from '../../middlewares/validar-campos.js';
import { validarJWT } from '../../middlewares/validar-jwt.js';

const router = Router();

// Iniciar una nueva conversación
router.post(
    '/conversation',
    [
        validarJWT, // Middleware para verificar el JWT
        check('recipientId', 'Recipient ID is required').not().isEmpty(),
        check('content', 'Message content is required').not().isEmpty(),
        validarCampos // Middleware para validar campos
    ],
    startConversation
);

router.get(
    '/conversations',
    validarJWT, // Middleware para verificar el JWT
    getConversations
);

// Obtener mensajes de una conversación específica
router.get(
    '/conversation/:conversationId/messages',
    validarJWT, // Middleware para verificar el JWT
    getMessages
);

export default router;
