import Request from './request.model.js';
import User from '../users/user.model.js';

export const createRequest = async (req, res) => {
    const { user } = req;

    try {
        if (user.role === "COMPANY_ROLE") {
            return res.status(400).json({ message: "You already have the COMPANY_ROLE." });
        }
        const existingRequest = await Request.findOne({ idUser: user._id, status: 'PENDING' });
        if (existingRequest) {
            return res.status(400).json({ message: "You already have a pending request." });
        }
        const newRequest = new Request({
            idUser: user._id,
            requestedRole: 'COMPANY_ROLE'
        });

        await newRequest.save();
        res.status(201).json({ success: true, data: newRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const listPendingRequests = async (req, res) => {
    const { user } = req;

    try {
        if (user.role !== "ADMIN_GENERAL") {
            return res.status(403).json({ message: "You do not have permission to view requests." });
        }

        // Obtener las solicitudes con estado PENDING o ACCEPTED
        const requests = await Request.find({ status: { $in: ['PENDING', 'ACCEPTED'] } }).populate('idUser', 'email username role');
        
        if (requests.length === 0) {
            return res.status(404).json({ message: "No requests found." });
        }

        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const acceptRequest = async (req, res) => {
    const { requestId } = req.params;
    const { user } = req;

    try {
        if (user.role !== "ADMIN_GENERAL") {
            return res.status(403).json({ message: "You do not have permission to accept requests." });
        }
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found." });
        }
        const userToUpdate = await User.findById(request.idUser);
        userToUpdate.role = 'COMPANY_ROLE';
        await userToUpdate.save();
        request.status = 'ACCEPTED';
        await request.save();

        res.status(200).json({ success: true, message: "Request accepted and role updated." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};