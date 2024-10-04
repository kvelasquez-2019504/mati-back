import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requestedRole: {
        type: String,
        enum: ['COMPANY_ROLE'],
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
        default: 'PENDING'
    }
   /* content: {
        type: String,
        required: true,
        trim: true
    }*/
});

export default mongoose.model('Request', RequestSchema);
