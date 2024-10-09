import Post from '../post/post.model.js'; // Asegúrate de importar el modelo Post
import Application from '../application/application.model.js'; // Modelo para las solicitudes de trabajo
import Notification from '../notification/notification.model.js'; // Modelo para las notificaciones

export const applyToJob = async (req, res) => {
    try {
        const { idPost } = req.params; // Obtiene el idPost desde los parámetros de la ruta
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

        // Enviar notificación a la empresa que creó el post
        const notificationData = {
            companyId: post.idUser,
            message: `User ${user.username} has applied to your job post: ${post.title}`,
            createdAt: new Date(),
        };
        await Notification.create(notificationData);

        res.status(201).json({ success: true, message: "Application submitted successfully.", data: newApplication });
    } catch (error) {
        console.error(error); // Agrega este log para ver el error en el backend
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserApplications = async (req, res) => {
    try {
        const user = req.user; // Obtiene el usuario autenticado
        const applications = await Application.find({ idUser: user._id }).populate('idPost'); // Obtiene todas las aplicaciones del usuario

        if (!applications.length) {
            return res.status(404).json({ success: false, message: 'No hay aplicaciones encontradas.' });
        }

        res.status(200).json({
            success: true,
            applications,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


