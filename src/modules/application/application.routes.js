import { Router } from "express";
import { check } from "express-validator";
import { applyToJob, getUserApplications } from "./application.controller.js";
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

router.get('/applications', validarJWT, getUserApplications); 

export default router;

