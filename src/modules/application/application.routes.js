import { Router } from "express";
import { check } from "express-validator";
import { applyToJob, getUserApplications, getApplicantsForJob } from "./application.controller.js"; // Asegúrate de importar la nueva función
import { validarCampos } from "../../middlewares/validar-campos.js";
import { validarJWT } from "../../middlewares/validar-jwt.js";

const router = Router();

// Ruta para que un usuario aplique a un trabajo
router.post(
    "/apply/:idPost",
    [
        validarJWT, // Middleware para verificar el JWT
        check("idPost", "post ID is required").not().isEmpty(),
        validarCampos // Middleware para validar campos
    ],
    applyToJob
);

// Ruta para que un usuario vea sus aplicaciones
router.get('/applications', validarJWT, getUserApplications);

// Nueva ruta para que el creador del post vea los usuarios que aplicaron
router.get(
    '/post/:idPost/applicants',
    [
        validarJWT, // Middleware para verificar el JWT
        check("idPost", "post ID is required").not().isEmpty(), // Verificamos que el idPost sea válido
        validarCampos // Middleware para validar campos
    ],
    getApplicantsForJob // Controlador para obtener los usuarios que aplicaron
);

export default router;


