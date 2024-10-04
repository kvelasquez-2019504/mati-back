export const isAdminGeneral = (req, res, next) => {
    const { role } = req.user;

    if (role !== 'ADMIN_GENERAL') {
        return res.status(403).json({ message: "You do not have permission to perform this action." });
    }
    
    next();
};

export default isAdminGeneral;


  