import { Router } from "express";
import { check } from "express-validator";
import multer from 'multer';  // Importar multer
import path from 'path';  // Importar path si se necesita para manejar archivos
import {
    createPost,
    getMyPostUser,
    getMyPostCompany,
    updatePost,
    deletePost,
    getAllPosts,
    searchPostsByAlphabet,
    uploadCV // Importar la nueva función
} from "./post.controller.js";
import { validarCampos } from "../../middlewares/validar-campos.js";
import { validarJWT } from "../../middlewares/validar-jwt.js";

const router = Router();

// Configuración de Multer para subir archivos PDF
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Carpeta donde se guardarán los archivos subidos
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Solo aceptar archivos PDF
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only PDFs are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter 
});

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

// Ruta para obtener todas las publicaciones
router.get('/allposts', getAllPosts);

// Ruta para subir el CV
router.post('/uploadCV/:id', upload.single('cvFile'), uploadCV);  // Añadimos el middleware upload para gestionar archivos

// Ruta para buscar publicaciones por la letra inicial de la compañía
router.get('/posts/alphabet', validarJWT, searchPostsByAlphabet);

// Obtener posts del usuario autenticado
router.get(
    "/posts",
    validarJWT, // Middleware para verificar el JWT
    getMyPostUser
);

// Obtener posts de la compañía autenticada
router.get(
    "/postsCompany",
    validarJWT, // Middleware para verificar el JWT
    getMyPostCompany
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


