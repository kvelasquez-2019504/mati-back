import { Schema, model } from 'mongoose';

const commentSchema = new Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    idPost: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default model('Comment', commentSchema);