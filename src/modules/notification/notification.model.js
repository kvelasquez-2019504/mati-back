import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Asegúrate de que 'User' es el modelo correcto para las empresas
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Notification', NotificationSchema);

