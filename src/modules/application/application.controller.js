import Application from './application.model.js';


export const applyToJob = async (req, res) => {
    try {
        const { idJob } = req.body;
        const user = req.user;

        const existingApplication = await Application.findOne({ idJob, idUser: user._id });
        if (existingApplication) {
            return res.status(400).json({ success: false, message: "You have already applied to this job." });
        }

        const applicationData = {
            idUser: user._id,
            idJob,
            appliedAt: new Date(),
        };
        const newApplication = await Application.create(applicationData);

        res.status(201).json({ success: true, message: "Application submitted successfully.", data: newApplication });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const user = req.user;

        const applications = await Application.find({ idUser: user._id }).populate('idJob');

        if (!applications.length) {
            return res.status(404).json({ success: false, message: "No job applications found." });
        }

        res.status(200).json({ success: true, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

