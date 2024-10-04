import User from "../src/modules/users/user.model.js";
import bcrypt from "bcryptjs";

export const createUserDefault = async () => {
    console.log("Creating default admin user...");
    try {
        const defaultUser = await User.findOne({ name: 'Admin' });
        if (!defaultUser) {
            const hashedPassword = await bcrypt.hash('@dmin-c0nf', 10);
            const newUser = new User({
                username: 'Admin',
                email: 'admin@gmail.com',
                password: hashedPassword,
                role: 'ADMIN_GENERAL',
            });

            await newUser.save();
            console.log("Default admin user created successfully.");
        } else {
            console.log("Default admin user already exists. \n Name: " + defaultUser.name + "\n Email: " + defaultUser.email);
        }
    } catch (error) {
        console.error("Error creating default admin user: ", error);
    }
};
