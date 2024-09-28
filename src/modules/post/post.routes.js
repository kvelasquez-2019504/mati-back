import { Router } from "express";
import { check } from "express-validator";
import {
    createPost,
    getMyPost,
    updatePost,
    deletePost
} from "./post.controller.js";
import { validarCampos } from "../../middlewares/validar-campos.js";
import { validarJWT } from "../../middlewares/validar-jwt.js";

const router = Router();

// Crear un nuevo post
router.post(
    "/post",
    [
        validarJWT, // Middleware para verificar el JWT
        check("company", "Title is required").not().isEmpty(),
        check("content", "Content is required").not().isEmpty(),
        check("category", "Category is required").not().isEmpty(),
        check("location", "Location is required").not().isEmpty(),
        validarCampos // Middleware para validar campos
    ],
    createPost
);

// Obtener posts del usuario autenticado
router.get(
    "/posts",
    validarJWT, // Middleware para verificar el JWT
    getMyPost
);

// Actualizar un post existente
router.put(
    "/post/:id",
    [
        validarJWT, // Middleware para verificar el JWT
        check("company", "Title is required").not().isEmpty(),
        check("content", "Content is required").not().isEmpty(),
        check("category", "Category is required").not().isEmpty(),
        validarCampos // Middleware para validar campos
    ],
    updatePost
);

// Eliminar (desactivar) un post
router.delete(
    "/post/:id",
    validarJWT, // Middleware para verificar el JWT
    deletePost
);

export default router;

