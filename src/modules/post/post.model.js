import { Schema, model } from 'mongoose';

const postSchema = new Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['#IT', '#Engineering', '#Education', '#Administration', '#Marketing', '#Logistics'],
    },
    location: {
        type: String, 
        trim: true
    }, 
    status: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});

export default model('Post', postSchema);
