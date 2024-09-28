import { Schema, model } from 'mongoose';

const postSchema = new Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    company: {
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
        trim: true
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
