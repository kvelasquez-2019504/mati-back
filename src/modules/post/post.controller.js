import Post from "./post.model.js";
import Comments from "../comment/comment.model.js";
import User from "../users/user.model.js";
// Create a post
export const createPost = async (req, res) => {
    try {
        const { title, content, category, location} = req.body;
        const user = req.user; // Accede al usuario desde req.user

        if (user.role !== "COMPANY_ROLE") {
            return res.status(403).json({ success: false, message: "You do not have permission to create a post." });
        }

        const postData = {
            idUser: user._id,
            title,
            content,
            category, 
            location
        };

        const newPost = await Post.create(postData);

        res.status(201).json({ success: true, data: newPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user posts
export const getMyPost = async (req, res) => {
    try {
        const user = req.user; // Accede al usuario desde req.user
        const posts = await Post.find({ status: true, idUser: user._id });//devuelve un arrego de posts del id del usuario
        let arrayObjetoPostYComentarios = [];//relacion post y comentario

        let arrayComentarios = [];//array donde guardamos los comentarios
        for (let post of posts) {
            let commentOfPost = await Comments.find({ idPost: post._id });//buscamos los comentarios del post
            for(let comment of commentOfPost){
                let user = await User.findOne({ _id: comment.idUser });//buscamos el usuario que hizo el comentario
                arrayComentarios.push({username:user.username, contentComment:comment.content});//guardamos el usuario y el comentario en un objeto con atributos user y contentComment
            }
            arrayObjetoPostYComentarios.push({ post: post.title, content:post.content,category:post.category, location:post.location, commentOfPost: arrayComentarios });//guardamos el post y los comentarios en un objeto
            arrayComentarios = [];//vaciamos el array de comentarios de cada post
        }
        res.status(200).json({
            success: true,
            postYComentario: arrayObjetoPostYComentarios
        });
        //res.status(200).json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update an existing post
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category } = req.body;
        const user = req.user; // Accede al usuario desde req.user

        // Verifica el rol del usuario
        if (user.role !== "COMPANY_ROLE") {
            return res.status(403).json({ success: false, message: "You do not have permission to edit this post." });
        }

        const updatedPost = await Post.findOneAndUpdate(
            { _id: id, status: true, idUser: user._id }, // Verifica si el post pertenece al usuario
            { title, content, category },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ success: false, message: "Post not found or you are not the author" });
        }

        res.status(200).json({ success: true, data: updatedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete (deactivate) a post
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user; // Accede al usuario desde req.user

        // Verifica el rol del usuario
        if (user.role !== "COMPANY_ROLE") {
            return res.status(403).json({ success: false, message: "You do not have permission to delete this post." });
        }

        const deletedPost = await Post.findOneAndUpdate(
            { _id: id, idUser: user._id }, // Verifica si el post pertenece al usuario
            { status: false },
            { new: true }
        );

        if (!deletedPost) {
            return res.status(404).json({ success: false, message: "Post not found or you are not the author" });
        }

        res.status(200).json({ success: true, data: deletedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

