import { Router } from "express";
import { check } from "express-validator";
import { applyToJob, getAppliedJobs } from "./application.controller.js";
import { validarCampos } from "../../middlewares/validar-campos.js";
import { validarJWT } from "../../middlewares/validar-jwt.js";

const router = Router();

// Ruta para que un usuario aplique a un trabajo
router.post(
    "/apply",
    [
        validarJWT, // Middleware para verificar el JWT
        check("idJob", "Job ID is required").not().isEmpty(),
        validarCampos // Middleware para validar campos
    ],
    applyToJob
);

// Ruta para obtener la lista de trabajos a los que el usuario ha aplicado
router.get(
    "/applications",
    validarJWT, // Middleware para verificar el JWT
    getAppliedJobs
);

export default router;
