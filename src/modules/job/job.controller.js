import Job from './job.model.js';
import Application from '../application/application.model.js';
import User from "../users/user.model.js";

// Obtener los usuarios que han aplicado a un trabajo específico
export const getApplicantsForJob = async (req, res) => {
    try {
        const { id } = req.params;  // ID del trabajo
        const user = req.user;  // Usuario autenticado

        // Verifica que el usuario autenticado es el creador del trabajo
        const job = await Job.findOne({ _id: id, idUser: user._id });
        if (!job) {
            return res.status(403).json({ success: false, message: "You do not have permission to view applicants for this job." });
        }

        // Encuentra las aplicaciones para este trabajo
        const applications = await Application.find({ idJob: id }).populate('idUser', 'username email');

        if (!applications.length) {
            return res.status(404).json({ success: false, message: "No applicants found for this job." });
        }

        // Prepara la lista de aplicantes con los detalles del usuario
        const applicants = applications.map(application => ({
            username: application.idUser.username,
            email: application.idUser.email,
            appliedAt: application.createdAt
        }));

        res.status(200).json({ success: true, data: applicants });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createJob = async (req, res) => {
    try {
        const { title, description, company, category, location} = req.body;
        const user = req.user;

        if (user.role !== "COMPANY_ROLE") {
            return res.status(403).json({ success: false, message: "You do not have permission to create a job." });
        }

        const jobData = {
            idUser: user._id,
            title,
            description,
            company,
            category,
            location,
        };

        const newJob = await Job.create(jobData);

        res.status(201).json({ success: true, data: newJob });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyJobs = async (req, res) => {
    try {
        const user = req.user;
        const jobs = await Job.find({ idUser: user._id });

        res.status(200).json({
            success: true,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, company, category, location } = req.body;
        const user = req.user;

        if (user.role !== "COMPANY_ROLE") {
            return res.status(403).json({ success: false, message: "You do not have permission to edit this job." });
        }

        const updatedJob = await Job.findOneAndUpdate(
            { _id: id, idUser: user._id },
            { title, description, company, category, location},
            { new: true }
        );

        if (!updatedJob) {
            return res.status(404).json({ success: false, message: "Job not found or you are not the author" });
        }

        res.status(200).json({ success: true, data: updatedJob });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        if (user.role !== "COMPANY_ROLE") {
            return res.status(403).json({ success: false, message: "You do not have permission to delete this job." });
        }

        const deletedJob = await Job.findOneAndUpdate(
            { _id: id, idUser: user._id },
            { status: false },
            { new: true }
        );

        if (!deletedJob) {
            return res.status(404).json({ success: false, message: "Job not found or you are not the author" });
        }

        res.status(200).json({ success: true, data: deletedJob });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


