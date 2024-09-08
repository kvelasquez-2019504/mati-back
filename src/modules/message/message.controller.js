import Conversation from '../conversation/conversation.model.js';
import Message from './message.model.js';
import User from '../users/user.model.js';
// Iniciar una nueva conversación o encontrar una existente
export const startConversation = async (req, res) => {
    try {
        const { recipientId, content } = req.body; // recipientId es el ID de la empresa
        const sender = req.user._id; // Usuario autenticado
        // Verificar que el destinatario es una empresa
        const recipient = await User.findById(recipientId);
        if (!recipient || recipient.role !== 'COMPANY_ROLE') {
            return res.status(400).json({ success: false, message: 'Recipient must be a company.' });
        }
        // Crear una nueva conversación
        let conversation = await Conversation.findOne({
            participants: { $all: [sender, recipientId] }
        });
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [sender, recipientId]
            });
        }
        // Crear un nuevo mensaje
        const message = await Message.create({
            conversation: conversation._id,
            sender,
            content
        });
        conversation.messages.push(message._id);
        await conversation.save();
        res.status(201).json({ success: true, data: message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Obtener todas las conversaciones del usuario autenticado
export const getConversations = async (req, res) => {
    try {
        const user = req.user._id;
        // Encuentra todas las conversaciones donde el usuario es uno de los participantes
        const conversations = await Conversation.find({
            participants: user
        }).populate({
            path: 'messages',
            populate: { path: 'sender', select: 'username' }
        }).populate('participants', 'username');
        res.status(200).json({ success: true, data: conversations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Obtener mensajes de una conversación específica
export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        // Encuentra la conversación y sus mensajes
        const conversation = await Conversation.findById(conversationId)
            .populate({
                path: 'messages',
                populate: { path: 'sender', select: 'username' }
            });
        if (!conversation) {
            return res.status(404).json({ success: false, message: 'Conversation not found.' });
        }
        res.status(200).json({ success: true, data: conversation.messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
