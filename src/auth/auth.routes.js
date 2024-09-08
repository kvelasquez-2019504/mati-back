import { Router } from "express";
import { check } from "express-validator";
import { login, register } from "./auth.contoller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { existeEmail } from "../helpers/db-validators.js";

const router = Router()

router.post('/login', 
    [
        check('email', 'This is not a valid email').isEmail(),
        check('password','Password is required').not().isEmpty(),
        check('password','The password must be greater than 8 characters').isLength({min:8,}),
        validarCampos
    ], login)

router.post('/register', 
    [
        check('email', 'This is not a valid email').isEmail(),
        check('email').custom(existeEmail),
        check('username','Username is required').not().isEmpty(),
        check('password','Password is required').not().isEmpty(),
        check('password','The password must be greater than 8 characters').isLength({min:8,}),
        validarCampos
    ], register)

export default router;