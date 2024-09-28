import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    idPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Application', ApplicationSchema);
