import { Router } from "express";
import { check } from "express-validator";
import {
    getApplicantsForJob,
    createJob,
    getMyJobs,
    updateJob,
    deleteJob
} from "./job.controller.js"
import { validarCampos } from "../../middlewares/validar-campos.js";
import { validarJWT } from "../../middlewares/validar-jwt.js";

const router = Router();

router.get(
    "/applicantsJob/:id",
    validarJWT, // Middleware para verificar el JWT
    getApplicantsForJob
);

// Crear un nuevo post
router.post(
    "/job",
    [
        validarJWT, // Middleware para verificar el JWT
        check("title", "Title is required").not().isEmpty(),
        check("description", "description is required").not().isEmpty(),
        check("company", "company is required").not().isEmpty(),
        check("category", "category is required").not().isEmpty(),
        check("location", "Location is required").not().isEmpty(),
        validarCampos // Middleware para validar campos
    ],
    createJob
);

// Obtener posts del usuario autenticado
router.get(
    "/jobs",
    validarJWT, // Middleware para verificar el JWT
    getMyJobs
);

// Actualizar un post existente
router.put(
    "/job/:id",
    [
        validarJWT, // Middleware para verificar el JWT
        check("title", "Title is required").not().isEmpty(),
        check("description", "Content is required").not().isEmpty(),
        check("company", "company is required").not().isEmpty(),
        check("category", "Category is required").not().isEmpty(),
        check("location", "location is required").not().isEmpty(),
        validarCampos // Middleware para validar campos
    ],
    updateJob
);

// Eliminar (desactivar) un post
router.delete(
    "/job/:id",
    validarJWT, // Middleware para verificar el JWT
    deleteJob
);

export default router;