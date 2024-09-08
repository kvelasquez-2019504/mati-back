import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['#IT', '#Engineering', '#Education', '#Administration', '#Marketing', '#Logistics'],
    },
    location: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
