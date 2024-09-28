import Post from '../post/post.model.js'; // Asegúrate de importar el modelo Post
import Application from '../application/application.model.js'; // Si tienes un modelo Application para las solicitudes
import Notification from '../notification/notification.model.js';

export const applyToJob = async (req, res) => {
    try {
        const { idPost } = req.body; // Cambiamos a idPost en lugar de idJob
        const user = req.user; // Usuario que aplica

        // Verificamos si el usuario ya aplicó a este trabajo (post)
        const existingApplication = await Application.findOne({ idPost, idUser: user._id });
        if (existingApplication) {
            return res.status(400).json({ success: false, message: "You have already applied to this job." });
        }

        // Verificar que el post exista y sea válido
        const post = await Post.findById(idPost);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found." });
        }

        // Crear nueva aplicación
        const applicationData = {
            idUser: user._id,
            idPost,
            appliedAt: new Date(),
        };
        const newApplication = await Application.create(applicationData);

        // Enviar notificación a la empresa que creó el post (usando el idUser del post)
        const notificationData = {
            companyId: post.idUser, // El usuario que creó el post es la empresa
            message: `User ${user.username} has applied to your job post: ${post.title}`,
            createdAt: new Date(),
        };
        await Notification.create(notificationData); // Crear notificación (asume que tienes un modelo Notification)

        res.status(201).json({ success: true, message: "Application submitted successfully.", data: newApplication });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


