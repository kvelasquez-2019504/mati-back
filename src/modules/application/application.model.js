import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    idJob: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;
