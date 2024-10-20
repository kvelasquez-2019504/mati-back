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

// Search posts by alphabet
export const searchPostsByAlphabet = async (req, res) => {
    try {
        const { letter } = req.query; // Obtener la letra de la consulta

        if (!letter || letter.length !== 1) {
            return res.status(400).json({ success: false, message: "Please provide a valid letter." });
        }

        // Convertir la letra a mayúscula para estandarizar la búsqueda
        const uppercaseLetter = letter.toUpperCase();

        // Buscar publicaciones cuyo nombre de compañía empiece con la letra proporcionada
        const posts = await Post.find({
            status: true,
            company: { $regex: `^${uppercaseLetter}`, $options: "i" } // Ignorar mayúsculas/minúsculas
        });

        if (posts.length === 0) {
            return res.status(404).json({ success: false, message: "No posts found starting with the provided letter." });
        }

        res.status(200).json({ success: true, data: posts });
    } catch (error) {
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
export const getMyPostUser = async (req, res) => {
    try {
        const user = req.user; // Asegúrate de que el usuario está autenticado
        const posts = await Post.find({ status: true });
        let arrayObjetoPostYComentarios = [];

        for (let post of posts) {
            let commentOfPost = await Comments.find({ idPost: post._id });
            let arrayComentarios = [];

            for (let comment of commentOfPost) {
                let userComment = await User.findOne({ _id: comment.idUser });
                arrayComentarios.push({
                    username: userComment.username,
                    contentComment: comment.content,
                });
            }

            arrayObjetoPostYComentarios.push({
                _id: post._id,
                post: post.company,
                content: post.content,
                category: post.category,
                location: post.location,
                commentOfPost: arrayComentarios,
                // Incluir un campo para subir el archivo CV
                cvFile: post.cvFile || null, // Si ya tiene un CV, se muestra
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

// Ruta para manejar la subida del archivo CV
export const uploadCV = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found." });
        }

        post.cvFile = req.file.path; // Guardar la ruta del archivo
        await post.save();

        res.status(200).json({ success: true, message: "CV uploaded successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user posts
export const getMyPostCompany = async (req, res) => {
    try {
        const user = req.user; // Asegúrate de que el usuario está autenticado
        
        // Filtra los posts por el id del usuario
        const posts = await Post.find({ status: true, idUser: user._id }); // Obtiene solo las publicaciones del usuario actual
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

            // Agrega la publicación al arreglo de resultados, incluyendo el _id
            arrayObjetoPostYComentarios.push({
                _id: post._id, // Añadir el _id de la publicación
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

