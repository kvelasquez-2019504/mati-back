import { Router } from "express"; 
import { check } from "express-validator"; 
import { createComment,deleteComment,getCommentsOfPost, updateComment } from "./comment.controller.js";
import { validarCampos } from "../../middlewares/validar-campos.js";
import { validarJWT } from "../../middlewares/validar-jwt.js"; 

const router = Router(); 

router.post(
    "/comment", 
    [
        validarJWT, 
        check("idPost", "Post is required").not().isEmpty(), 
        check("content", "Content is required").not().isEmpty(),
        validarCampos
    ], 
    createComment
);
router.put(
    "/update/:id", 
    [
        validarJWT, 
        check("content", "content is required").not().isEmpty(),
        validarCampos
    ], 
    updateComment
);
router.delete(
    "/delete/:id", 
    [
        validarJWT, 
        validarCampos
    ], 
    deleteComment
)
router.get("/comment",[
    validarJWT, 
    check("idPost", "Post is required").not().isEmpty(),
] ,getCommentsOfPost);
export default router;