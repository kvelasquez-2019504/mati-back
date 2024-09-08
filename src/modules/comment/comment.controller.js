import Comment from "./comment.model.js"; 
import Post from '../post/post.model.js';
// Create a comment 
export const createComment = async (req, res) => {
    try{
        const { idPost, content} = req.body; 
        const user = req.user; 
        const commentData = { 
            idUser: user._id, 
            idPost, 
            content
        };
        const newComment = await Comment.create(commentData);
        res.status(201).json({ success: true, data: newComment });
    }catch(error) {
        res.status(500).json({succes: false, message: error.message});
    }
};

export const getCommentsOfPost = async(req,res)=>{
    try {
        const {idPost}= req.body;
        const post = await Post.find({_id:idPost});
        const comments = await Comment.find({idPost:idPost});
        res.status(200).json({
            success:true, 
            post:post,
            comments:comments
        });
    } catch (error) {
        res.status(500).json({success:false, message:error.message});
    }
}

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const user = req.user;
        const comment = await Comment.findOne({ _id: id, idUser: user._id });
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found or you are not authorized to update it." });
        }
        comment.content = content;
        await comment.save();

        res.status(200).json({ success: true, message: "Comment updated successfully.", data: comment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params; // ID del comentario a eliminar
        const user = req.user; // Usuario autenticado

        // Busca el comentario por su ID y verifica que pertenece al usuario autenticado
        const comment = await Comment.findOne({ _id: id, idUser: user._id });

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found or you are not authorized to delete it." });
        }

        // Elimina el comentario usando deleteOne
        await Comment.findByIdAndDelete({ _id: id });

        res.status(200).json({ success: true, message: "Comment deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

