import Post from "./post.model.js";
import Comments from "../comment/comment.model.js";
import User from "../users/user.model.js";
// Create a post
export const createPost = async (req, res) => {
    try {
        const { company, content, category, location } = req.body;
        const user = req.user;

        if (user.role !== "COMPANY_ROLE") {
            return res.status(403).json({ success: false, message: "You do not have permission to create a post." });
        }

        const postData = {
            idUser: user._id,
            company,
            content,
            category,
            location,
        };

        const newPost = await Post.create(postData);
        res.status(201).json({ success: true, data: newPost });
    } catch (error) {
        console.error("Error en createPost:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllPosts = async (req, res) => {
    try {

        const posts = await Post.find({ status: true });
        let arrayObjetoPostYComentarios = [];

        for (let post of posts) {
            let commentOfPost = await Comments.find({ idPost: post._id });
            let arrayComentarios = [];

            for (let comment of commentOfPost) {
                let user = await User.findOne({ _id: comment.idUser });
                arrayComentarios.push({
                    username: user.username,
                    contentComment: comment.content
                });
            }
            arrayObjetoPostYComentarios.push({
                post: post.company,
                content: post.content,
                category: post.category,
                location: post.location,
                commentOfPost: arrayComentarios
            });
        }
        res.status(200).json({
            success: true,
            postYComentario: arrayObjetoPostYComentarios
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Get user posts
export const getMyPost = async (req, res) => {
    try {
        const user = req.user; // Asegúrate de que el usuario está autenticado
        const posts = await Post.find({ status: true }); // Obtiene todas las publicaciones activas
        let arrayObjetoPostYComentarios = [];

        for (let post of posts) {
            let commentOfPost = await Comments.find({ idPost: post._id }); // Obtiene los comentarios para cada publicación
            let arrayComentarios = [];

            for (let comment of commentOfPost) {
                let userComment = await User.findOne({ _id: comment.idUser }); // Obtiene el usuario que hizo el comentario
                arrayComentarios.push({
                    username: userComment.username,
                    contentComment: comment.content,
                });
            }

            // Agrega la publicación al arreglo de resultados
            arrayObjetoPostYComentarios.push({
                post: post.company,
                content: post.content,
                category: post.category,
                location: post.location,
                commentOfPost: arrayComentarios,
            });
        }

        res.status(200).json({
            success: true,
            postYComentario: arrayObjetoPostYComentarios,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Update an existing post
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { company, content, category } = req.body;
        const user = req.user; // Accede al usuario desde req.user

        // Verifica el rol del usuario
        if (user.role !== "COMPANY_ROLE") {
            return res.status(403).json({ success: false, message: "You do not have permission to edit this post." });
        }

        const updatedPost = await Post.findOneAndUpdate(
            { _id: id, status: true, idUser: user._id }, // Verifica si el post pertenece al usuario
            { company, content, category },
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

