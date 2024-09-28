import { Router } from "express";
import { check } from "express-validator";
import { applyToJob } from "./application.controller.js";
import { validarCampos } from "../../middlewares/validar-campos.js";
import { validarJWT } from "../../middlewares/validar-jwt.js";
import Notification from '../notification/notification.model.js'; // Asegúrate de importar el modelo de Notificación

const router = Router();

// Ruta para que un usuario aplique a un trabajo
router.post(
    "/apply",
    [
        validarJWT, // Middleware para verificar el JWT
        check("idPost", "post ID is required").not().isEmpty(),
        validarCampos // Middleware para validar campos
    ],
    applyToJob
);

// Nueva ruta para obtener las notificaciones de una empresa
router.get(
    "/:companyId/notifications",
    validarJWT, // Verifica que la empresa esté autenticada
    async (req, res) => {
        const { companyId } = req.params;

        try {
            // Buscar las notificaciones de la empresa
            const notifications = await Notification.find({ companyId }).sort({ createdAt: -1 });
            res.status(200).json({ success: true, data: notifications });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
);

export default router;

